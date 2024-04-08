let mongoose = require("mongoose");
let router = require("express").Router();
let auth = require("../auth");
let Config = mongoose.model("Config");
let {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");


router.get('/', auth.required, auth.admin, (req, res, next) => {
    Config.findOne((err, config) => {
        if (err) {
            return next(err);
        }
        if (!config) {
            return next(new BadRequestResponse("Config not found"));
        }

        next(new OkResponse(config));
    });
});

router.put('/', auth.required, auth.admin, (req, res, next) => {
    Config.findOne((err, config) => {
        if (err) {
            return next(err);
        }
        if (!config) {
            return next(new BadRequestResponse("Config not found"));
        }

        config.referralReward = req.body.referralReward || config.referralReward;
        config.tenUsersReward = req.body.tenUsersReward || config.tenUsersReward;

        config.save((err, config) => {
            if (err) {
                return next(err);
            }

            next(new OkResponse(config));
        });
    });
});

module.exports = router;