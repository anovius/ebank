const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const smtpAuth = require("../config").smtpAuth;

console.log(smtpAuth);

const sendEmail = (mailDetails) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.porkbun.com",  
    secure: true,
    port: 465,
    debug: true,
    auth: smtpAuth
  });
  // Open template file
  var source = fs.readFileSync(
    path.join(__dirname, "../templates/email.hbs"),
    "utf8"
  );
  // Create email generator
  var template = Handlebars.compile(source);
  transporter.sendMail(
    { ...mailDetails, 
      html: template(mailDetails.templateObj)
    },
    function (err, info) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent", info);
      }
    }
  );
};

const sendEmailVerificationOTP = async (user) => {
  console.log(user);
  sendEmail({
    from: "support@ebankc.io",
    to: user.email,
    subject: "EBankc Email Verification",
    templateObj: {
      ...user,
      heading: 'VERIFY YOUR<br>EMAIL ADDRESS',
      data: 'Welcome to EBankc App! Please click the button below to verify your email address',
      emailText: `<a href="${user.link}" style=" text-decoration:none; font-family: 'Roboto', sans-serif;background-color: #013220;color: #fff;
      border: 0; border-radius: 4px;font-size: 24px; cursor: pointer; font-weight: 400; padding: 12px 20px;
          ">VERIFY MY EMAIL ADDRESS</a>`,
    },
  });
};

const sendForgotPasswordOtp = async (user) => {
  console.log(user);
  sendEmail({
    from: "support@ebankc.io",
    to: user.email,
    subject: "EBankc Password Reset",
    templateObj: {
      ...user,
      heading: 'Reset Password',
      data: 'To reset your password click the link below',
      emailText: `<a href="${user.link}" style=" text-decoration:none; font-family: 'Roboto', sans-serif;background-color: #013220;color: #fff;
      border: 0; border-radius: 4px;font-size: 24px; cursor: pointer; font-weight: 400; padding: 12px 20px;
          ">Reset Password</a>`,
    },
  });
};

const sendTwoFactorOtp = async (user) => {
  console.log(user);
  sendEmail({
    from: "support@ebankc.io",
    to: user.email,
    subject: "EBankc Email Verification",
    templateObj: {
      ...user,
      heading: `Don't Share <br> this OTP`,
      data: 'Enter the OTP to complete the process',
      emailText: `<div style=" text-decoration:none; width:100%;
      border: 0; border-radius: 4px;
          "><h1 style="font-family: 'Roboto', sans-serif;background-color: #013220;color: #fff;font-size: 24px; cursor: pointer; font-weight: 400; padding: 12px 20px;">${user.otp}</h1></div>`,
    },
  });
};

const sendGeneralEmail = async (user) => {
  console.log(user);
  sendEmail({
    from: "support@ebankc.io",
    to: user.email,
    subject: user.subject,
    templateObj: {
      ...user,
      heading: user.subject,
      data: user.body,
      emailText: ``,
    },
  });
};

const sendSimpleEmail = async (details) => {
  sendEmail({
    from: " EBankc Contact <verify@SMARTUP.dk>",
    to: 'anovius10@gmail.com',
    subject: "EBankc Contact Form",
    templateObj: {
      emailText: `Name: ${details.firstName} ${details.lastName} <br/>Email: ${details.email} <br/>Phone Number: ${details.phone} <br/>Message: ${details.message}  `,
    },
  });
}


const sendEmailVerificationSuccess = async (user) => {
  sendEmail({
    from: " EBankc No/tification <verify@SMARTUP.dk>",
    to: user.email,
    subject: "Your Email verified successfully",
    templateObj: {
      ...user,
      emailText: `
      <h1>Welcome to EBankc</h1>. <br>
        you have successfully verified your email address. <br>
        <i>Let's Play</i>
      `,
    },
  });
};
const sendEmailOTP = async (user) => {
  sendEmail({
    from: "support@ebankc.io",
    to: user.email,
    subject: "OTP Request",
    templateObj: {
      ...user,
      emailText: `
      <p>We received an OTP request on your EBankc Account.</p>.
      <p>Enter this OTP to complete the process.</p>
      `,
    },
  });
};

const sendEmailForgotPasswordSuccess = async (user) => {
  sendEmail({
    from: "support@ebankc.io",
    to: user.email,
    subject: "Your Account's password has been reset",
    templateObj: {
      ...user,
      emailText: `
      Your password for the ${user.email} has been reset successfully. <br>
        <i>Let's Play</i>
      `,
    },
  });
};

const sendEmailCreateAdmin = async (user) => {
  sendEmail({
    from: "support@ebankc.io",
    to: user.email,
    subject: "Your Admin Account is live",
    templateObj: {
      ...user,
      emailText: `
      Congratulations – your account is live and ready for action. You now have access to EBankc admin.
      Your password for the ${user.email} need to be reset. <br>
      `,
    },
  });
};
module.exports = {
  sendEmailVerificationOTP,
  sendEmailVerificationSuccess,
  sendEmailOTP,
  sendEmailForgotPasswordSuccess,
  sendEmailCreateAdmin,
  sendSimpleEmail,
  sendTwoFactorOtp,
  sendGeneralEmail,
  sendForgotPasswordOtp
  // sendEmailForgotPasswordOTP,
};
