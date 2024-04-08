let mongoose = require("mongoose");
let router = require("express").Router();
let passport = require("passport");
let User = mongoose.model("User");
let Wallet = mongoose.model("Wallet");
let auth = require("../auth");
let {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");
const {
  sendEmailVerificationOTP,
  sendEmailVerificationSuccess,
  sendEmailOTP,
  sendForgotPasswordOtp,
  sendTwoFactorOtp,
  sendGeneralEmail,
  sendEmailForgotPasswordSuccess,
} = require("../../utilities/emailService");

let config = require("../../config");


router.post("/signup", async (req, res, next) => {
  if(!req.body.user){
    return next(new BadRequestResponse("User is required"));
  }
  let user = new User(req.body.user);
  user.setPassword(req.body.user.password);
  if(req.body.referralCode){
    user.refereedBy = req.body.referralCode;
    let foundUser = await User.findOne({referralCode: req.body.referralCode});
    if(foundUser){
      foundUser.referralUsedBy.push(user._id);
      foundUser.referralCounter += 1;
      await foundUser.save();
    }
  }
  user.setOTP();
  let wallet = new Wallet();
  await wallet.save();
  user.wallet = wallet._id;
  user.save((err, user) => {
    if (err) {
      next (new BadRequestResponse(err));
    }
    else{
      let link = `${config.backend}/api/user/verify/${user.email}/${user.otp}`;
      sendEmailVerificationOTP({...user.toJSON(), link: link});
      next(new OkResponse({message: "Signup successfully"}));
    }
  });
})

router.post("/login", (req, res, next) => {
  console.log(req.body);
  passport.authenticate(
    "local",
    { session: false },
    function (err, user, info) {
      if (err) {
        next(new BadRequestResponse(err.message));
      }
      if (user && user.status === 0) {
        next(new UnauthorizedResponse("Your email is not approved", 402));
      } else if (user && user.status === 2) {
        next(
          new UnauthorizedResponse(
            "Your Account is Blocked!, Contact to Support please",
            403,
          ),
        );
      }
      else if (user) {
        user.setOTP();
        user.save((err, user) => {
          sendTwoFactorOtp({...user.toJSON(), otp: user.otp});
          next(new OkResponse({ user: user.toAuthJSON() }));
        })
      } else {
        next(new UnauthorizedResponse());
      }
    },
  )(req, res, next);
})

router.get('/verify/:email/:otp', (req, res, next) => {
  User.findOne({ email: req.params.email }, (err, user) => {
    if (err) {
      return next(new BadRequestResponse(err));
    }

    if (!user) {
      return next(new BadRequestResponse("User not found"));
    }

    if (user.otp !== +req.params.otp) {
      return next(new BadRequestResponse("OTP is not valid"));
    }

    if (user.otpExpires < Date.now()) {
      return next(new BadRequestResponse("OTP is expired"));
    }

    user.status = 1;
    user.otp = null;
    user.otpExpires = null;

    user.save((err, user) => {
      if (err|| !user) {
        return next(new BadRequestResponse(err));
      }

      res.redirect(`${config.frontend}/login`);
    });
  });
});

router.post("/twoFactor", (req, res, next) => {
  if(!req.body.user){
    return next(new BadRequestResponse("User is required"));
  }

  User.findOne({ email: req.body.user.email }, (err, user) => {
    if (err) {
      return next(new BadRequestResponse(err));
    }
    if (user.otp !== +req.body.user.otp) {
      return next(new BadRequestResponse("OTP is not valid"));
    }

    if (user.otpExpires < Date.now()) {
      return next(new BadRequestResponse("OTP is expired"));
    }

    user.otp = null;
    user.otpExpires = null;

    user.save((err, user) => {
      if (err|| !user) {
        return next(new BadRequestResponse(err));
      }

      next(new OkResponse({ user: user.toAuthJSON() }));
    })
  });
});

router.get('/context', auth.required, auth.user, (req, res, next) => {
  next(new OkResponse({ user: req.user.toAuthJSON() }));
});

router.get('/get/all', auth.required, auth.admin, (req, res, next) => {
  let query = {role: 1};

  if(req.query.search){
    query.email = new RegExp(req.query.search, 'i');
  }

  User.find(query, (err, users) => {
    if (err) {
      return next(new BadRequestResponse(err));
    }
    next(new OkResponse({ users: users }));
  });
});

router.post('/email', auth.required, auth.admin, async (req, res, next) => {
  if(!req.body.email){
    return next(new BadRequestResponse("Email is required"));
  }

  let user = {
    email: req.body.email.user,
    subject: req.body.email.subject,
    body: req.body.email.body,
  }

  await sendGeneralEmail(user);

  next(new OkResponse({ message: "Email sent successfully" }));

})


router.post('/email/all', auth.required, auth.admin, async (req, res, next) => {
  if(!req.body.email){
    return next(new BadRequestResponse("Email is required"));
  }

  User.find({role: 1}, (err, users) => {
    if (err) {
      return next(new BadRequestResponse(err));
    }

    users.forEach(async (u) => {
      
      let user = {
        email: u.email,
        subject: req.body.email.subject,
        body: req.body.email.body,
      }
    
      await sendGeneralEmail(user);
    
      next(new OkResponse({ message: "Email sent successfully" }));
    })
    
  });
})

// api for admin to change status of user 

router.post('/change/status', auth.required, auth.admin, async (req, res, next) => {
  if(!req.body.user){
    return next(new BadRequestResponse("User is required"));
  }

  User.findOne({ email: req.body.user.email }, (err, user) => {
    if (err) {
      return next(new BadRequestResponse(err));
    }
    if (!user) {
      return next(new BadRequestResponse("User not found"));
    }

    user.status = req.body.user.status;

    user.save((err, user) => {
      if (err|| !user) {
        return next(new BadRequestResponse(err));
      }

      next(new OkResponse({ user: user.toAuthJSON() }));
    })
  });
})


router.post('/forgot', (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return next(new BadRequestResponse(err));
    }
    if (!user) {
      return next(new BadRequestResponse("User not found"));
    }

    user.setOTP();
    user.save((err, user) => {
      let link = `${config.frontend}/reset/${user.email}/${user.otp}`;
      sendForgotPasswordOtp({...user.toJSON(), link: link});
      next(new OkResponse("Reset Password Link has been sent"));
    })
  })
})

router.post('/reset/password', (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return next(new BadRequestResponse(err));
    }
    if (!user) {
      return next(new BadRequestResponse("User not found"));
    }

    if (user.otp !== +req.body.otp) {
      return next(new BadRequestResponse("OTP is not valid"));
    }

    if (user.otpExpires < Date.now()) {
      return next(new BadRequestResponse("OTP is expired"));
    }

    user.setPassword(req.body.password);
    user.otp = null;
    user.otpExpires = null;

    user.save((err, user) => {
      if (err|| !user) {
        return next(new BadRequestResponse(err));
      }
      next (new OkResponse("Password has been changed successfully"));
    })
  })
})

router.get('/get/referrals', auth.required, auth.user, (req, res, next) => {
  next(new OkResponse({ referrals: req.user.referralUsedBy }));
})

module.exports = router;
