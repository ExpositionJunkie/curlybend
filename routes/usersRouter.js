const express = require("express");
const User = require("../models/user");
const passport = require("passport");
const router = express.Router();
const authenticate = require("../authenticate");
const cors = require("./cors");

/* Admin resources */
router
  .route("/")
  .get(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    function (req, res, next) {
      User.find()
        .then((users) => {
          (res.statusCode = 200),
            res.setHeader("Content-Type", "application/json");
          res.json(users);
        })
        .catch((err) => next(err));
    }
  );

router.post("/signup", cors.corsWithOptions, (req, res) => {
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
            res.json({
              success: true,
              status: "Registration Successful!",
              user: user,
            });
          });
        });
      }
    }
  );
});


router.post(
  "/login",
  cors.corsWithOptions,
  passport.authenticate("local"),
  (req, res) => {
    const token = authenticate.getToken({
      _id: req.user._id,
    });
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({
      success: true,
      token: token,
      status: "You are successfully logged in!",
    });
  }
);

router
  .route("/logout")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    if (req.session) {
      req.session.destroy();
      res.clearCookie("session-id");
      req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
    } else {
      const err = new Error("You are not logged in!");
      err.status = 401;
      return next(err);
    }
  });

module.exports = router;
