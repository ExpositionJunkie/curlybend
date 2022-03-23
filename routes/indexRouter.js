const express = require("express");
const indexRouter = express.Router();
const cors = require('./cors')

indexRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    res.statusCode = 200;
    res.render("index", {title: "Curlybooty"})
  })
  .post(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST is not permitted on index.");
  })
  .put(cors.cors,
    (req, res, next) => {
      res.statusCode = 403;
      res.end("PUT operation not supported on index");
    }
  )
  .delete(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.end("DELETE operation not supported on index");
  });

module.exports = indexRouter;
