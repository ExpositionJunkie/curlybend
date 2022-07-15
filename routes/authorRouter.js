const express = require("express");
const Blog = require("../models/blog");
const authorRouter = express.Router();
const authenticate = require("../authenticate");
const cors = require("./cors");

authorRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Blog.find({ "author.username": req.authorUsername })
      .sort({ _id: -1 })
      .populate("author")
      .populate("comments.author")
      .then((blogs) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(blogs);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end(
      "POST operation not supported on /author. This endpoint is only for GET requests."
    );
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      "PUT operation not supported on /author. This endpoint is only for GET requests"
    );
  })
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin, //delete all blogs allowed only to admin
    (req, res, next) => {
      Blog.deleteMany({ "author.username": req.user._id })
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );
