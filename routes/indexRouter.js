const express = require("express");
const indexRouter = express.Router();
const cors = require('./cors')

indexRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    res.statusCode = 200;
    res.render("index", {title: "Api for Curlybrackets.me", message: "Hello and welcome to api.curlybrackets.me. This api serves as an endpoint for data and is protected with authentication measures to provide users a way to update blogs and other information once they are signed up. Documentation at this time is limited due to the fact that this is a private API. More information will be provided should this API be made more public. Thank you for stopping by."})
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
