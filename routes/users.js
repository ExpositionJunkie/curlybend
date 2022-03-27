const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const router = express.Router();
const authenticate = require("../authenticate");
const cors = require("./cors");

/* GET users listing. */
router
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    res.send("respond with a resource");
  });

router
  .route("/signup")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .post(cors.corsWithOptions, (req, res) => {
    if (
      authenticate.checkEmail(req.body.email) &&
      authenticate.checkPassword(req.body.password)
    ) {
      User.register(
        new User({ email: req.body.email }),
        req.body.password,
        (err, user) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.json({ err: err });
          } else {
            if (req.body.username) {
              user.username = req.body.username;
            }
            if (req.body.admin) {
              user.admin = req.body.admin;
            }
            user.save((err) => {
              if (err) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.json({ err: err });
                return;
              }
              passport.authenticate("local")(req, res, () => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json({ success: true, status: "Registration Successful!" });
              });
            });
          }
        }
      );
    } else if (
      !authenticate.checkEmail(req.body.email) &&
      authenticate.checkPassword(req.body.password)
    ) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: false,
        errType: 101,
        status: "Content failed validation check at email.",
      });
    } else if (
      authenticate.checkEmail(req.body.email) &&
      !authenticate.checkPassword(req.body.password)
    ) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: false,
        errType: 202,
        status: "Content failed validation check at password.",
      });
    } else if (
      !authenticate.checkEmail(req.body.email) &&
      !authenticate.checkPassword(req.body.password)
    ) {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.json({
        success: false,
        errType: 303,
        status: "Content failed validation check at both email and password.",
      });
    }
  });

router
  .route("/login")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .post(cors.corsWithOptions, passport.authenticate("local"), (req, res) => {
    const token = authenticate.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
      success: true,
      token: token,
      status: "You are successfully logged in!",
    });
  });

router
  .route("/logout")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    if (req.session) {
      req.session.destroy();
      res.clearCookie("session-id");
      res.redirect("/");
    } else {
      const err = new Error("You are not logged in!");
      err.status = 401;
      return next(err);
    }
  });

module.exports = router;
