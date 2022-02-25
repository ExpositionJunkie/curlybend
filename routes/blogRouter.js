const express = require("express");
const blogRouter = express.Router();

blogRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    next();
  })
  .get((req, res) => {
    res.end("Will send all the blog entries to you!");
  })
  .post((req, res) => {
    res.end(
      `Will add the blog entry - id: ${req.body.blogId}, date: ${req.body.date} title: ${req.body.title}, Subtitle: ${req.body.subtitle}, text:${req.body.text} `
    );
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.end(
      "PUT operation not supported on /blog - please add your entry at blog/blogID instead."
    );
  })
  .delete((req, res) => {
    res.end("Deleting all blog entries! May you go with God.");
  });

module.exports = blogRouter;
