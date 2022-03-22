const express = require("express");

const indexRouter = express.Router();

indexRouter
  .route("/")
  .options((req, res) => res.sendStatus(200))
  .get((req, res) => {
    res.statusCode = 200;
    res.end("GET OPERATION SUCCESS - You have reached the index");
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.end("POST is not permitted on index.");
  })
  .put(
    (req, res) => {
      res.statusCode = 403;
      res.end("PUT operation not supported on index");
    }
  )
  .delete((req, res) => {
    res.statusCode = 403;
    res.end("DELETE operation not supported on index");
  });

module.exports = indexRouter;