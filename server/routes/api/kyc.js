let mongoose = require("mongoose");
let router = require("express").Router();
let auth = require("../auth");
let {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");

const {
    PassbaseClient,
    PassbaseConfiguration,
    ResponseFormats,
} = require("@passbase/node");

const apiKey = "ajXbxP9g4Jah7Uq0VJ9NbjNiQCbqFHhfZJmNrcKH8k33RTgYk9rHhKZeoCMKhoasj3B89Zx97gOeBemcZuqveMwnerWJ52C1bxhJtJDpnzowVHR1cSJm7qk1Q2qhPbeX";


router.get('/', auth.required, auth.user, async (req, res, next) => {
    next(new OkResponse({level: req.user.kycLevel}));
});


router.post('/', auth.required, auth.user, async (req, res, next) => {
    req.user.kycKey = req.body.kycKey;
    req.user.kycLevel++;
    req.user.save().then(user => {
        next(new OkResponse(user));
    }).catch(err => {   
        next(new BadRequestResponse(err));
    });
});

router.get('/karma', auth.required, auth.user, async (req, res, next) =>{
    next(new OkResponse(req.user.getKarmaLevel()));
});



module.exports = router;