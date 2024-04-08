let mongoose = require("mongoose");
let router = require("express").Router();
let auth = require("../auth");
let Blog = mongoose.model("Blog");
let {
  OkResponse,
  BadRequestResponse,
  UnauthorizedResponse,
} = require("express-http-response");

router.post("/", auth.required, auth.admin, (req, res, next) => {
    if(!req.body.blog){
        return next(new BadRequestResponse("Blog is required"));
    }

    let blog = new Blog(req.body.blog);

    blog.save((err, blog) => {
        if(err){
            return next(new BadRequestResponse(err.message));
        }

        next(new OkResponse(blog));
    })
})

router.get("/", (req, res, next) => {
    Blog.find({status: 1}, (err, blogs) => {
        if(err){
            return next(new BadRequestResponse(err.message));
        }

        next(new OkResponse(blogs));
    })
})

router.get("/details/:slug", (req, res, next) => {
    Blog.findOne({slug: req.params.slug}, (err, blog) => {
        if(err){
            return next(new BadRequestResponse(err.message));
        }

        next(new OkResponse(blog));
    })
})

router.put("/update/:slug", auth.required, auth.admin, (req, res, next) => {
    if(!req.body.blog){
        return next(new BadRequestResponse("Blog is required"));
    }

    Blog.findOne({slug: req.params.slug}, (err, blog) => {
        if(err){
            return next(new BadRequestResponse(err.message));
        }


        blog.title = req.body.blog.title || blog.title;
        blog.body = req.body.blog.body || blog.body;
        blog.cover = req.body.blog.cover || blog.cover;
        
        if(req.body.blog.status === 0){
            blog.status = 0;
        }

        blog.save((err, blog) => {
            if(err){
                return next(new BadRequestResponse(err.message));
            }

            next(new OkResponse(blog));
        })
    })
})

module.exports = router;