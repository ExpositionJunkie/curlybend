const express = require("express");
const indexRouter = express.Router();

indexRouter
  .route("/")
  .options((req, res, next) => res.sendStatus(200))
  .get((req, res, next) => {
    res.statusCode = 200;
    res.render("index", {title: "Curlybooty"})
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST is not permitted on index.");
  })
  .put(
    (req, res, next) => {
      res.statusCode = 403;
      res.end("PUT operation not supported on index");
    }
  )
  .delete((req, res, next) => {
    res.statusCode = 403;
    res.end("DELETE operation not supported on index");
  });

module.exports = indexRouter;
