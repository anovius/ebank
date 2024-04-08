let mongoose = require("mongoose");
let router = require("express").Router();
let auth = require("../auth");
let Team = mongoose.model("Team");
let {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");

router.post("/", auth.required, auth.admin, (req, res, next) => {
    if(!req.body.team){
        return next(new BadRequestResponse("Team is required"));
    }

    let team = new Team(req.body.team);

    team.save((err, team) => {
        if(err){
            return next(new BadRequestResponse(err.message));
        }

        next(new OkResponse(team));
    })
})

router.get("/", (req, res, next) => {
    Team.find({status: 1}, (err, teams) => {
        if(err){
            return next(new BadRequestResponse(err.message));
        }

        next(new OkResponse(teams));
    })
})

module.exports = router;