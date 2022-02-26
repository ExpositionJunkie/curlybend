const express = require("express");
const Blog = require("../models/blog");
const blogRouter = express.Router();

blogRouter
  .route("/")
  .get((req, res, next) => {
    Blog.find()
      .then((blogs) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(blogs);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Blog.create(req.body)
      .then((blog) => {
        console.log("Blog Created", blog);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(blog);
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end(
      "PUT operation not supported on /blog - please add your entry at blog/blogID instead."
    );
  })
  .delete((req, res, next) => {
    Blog.deleteMany()
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

blogRouter
  .route("/:blogId")
  .get((req, res, next) => {
    Blog.findById(req.params.blogId)
      .then((blog) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(blog);
      })
      .catch((err) => next(err));
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /blogs/${req.params.blogId}`);
  })
  .put((req, res, next) => {
    Blog.findByIdAndUpdate(
      req.params.blogId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((blog) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(blog);
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Blog.findByIdAndDelete(req.params.blogId)
      .then((response) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(response);
      })
      .catch((err) => next(err));
  });

module.exports = blogRouter;
