let mongoose = require("mongoose");
let router = require("express").Router();
let auth = require("../auth");
let Ticket = mongoose.model("Ticket");
let {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");

router.param("id", (req, res, next, id) => {
    Ticket.findById(id)
        .then((ticket) => {
            if (!ticket) {
                return next(new BadRequestResponse("Ticket not found"));
            }
            req.ticket = ticket;
            next();
        })
        .catch((err) => {
            next(new BadRequestResponse(err));
        })
})

router.post("/", auth.required, auth.user, (req, res, next) => {
    if(!req.body.ticket) {
        return next(new BadRequestResponse("Ticket is required"));
    }

    let ticket = new Ticket(req.body.ticket);
    ticket.by = req.user;

    ticket.save((err, ticket) => {
        if(err) {
            return next(new BadRequestResponse(err.message));
        }
        next(new OkResponse(ticket));
    });
})

router.get("/:id", auth.required, auth.user, (req, res, next) => {
    if(req.user.role === 2 || req.user === req.ticket.by) {
        next(new OkResponse(req.ticket));
    }
    else{
        next(new UnauthorizedResponse());
    }
})

router.get("/get/all", auth.required, auth.user, (req, res, next) => {
    let query = {};
    if(req.user.role !== 2) {
        query.by = req.user._id;
    }

    Ticket.find(query, (err, tickets) => {
        if(err) {
            return next(new BadRequestResponse(err.message));
        }
        next(new OkResponse(tickets));
    });
})

router.get("/admin/get/all", auth.required, auth.admin, (req, res, next) => {

    Ticket.find({}).exec((err, tickets) => {
            if(err) {
                console.log(err);
                return next(new BadRequestResponse(err.message));
            }
            next(new OkResponse(tickets));
    });
})

router.put("/status", auth.required, auth.admin, (req, res, next) => {
    Ticket.findOne({_id: req.body._id}, (err, ticket) => {
        if(err) {
            return next(new BadRequestResponse(err.message));
        }
        ticket.status = req.body.status;
        ticket.save((err, ticket) => {
            if(err) {
                return next(new BadRequestResponse(err.message));
            }
            next(new OkResponse("Success"));
        });
    })

})

module.exports = router;