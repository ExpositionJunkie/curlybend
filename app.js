const express = require("express");
const logger = require("morgan");
var createError = require("http-errors");
var path = require("path");
const config = require("./config");
const passport = require("passport");
const mongoose = require("mongoose");

//Routes
const blogRouter = require("./routes/blogRouter");
const usersRouter = require("./routes/users");

//Back to express
var app = express();

//Mongo
const url = config.mongoUrl;
const connect = mongoose.connect(url);
connect.then(() => {
  console.log("Connected to db!");
  (err) => console.log(err);
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.all("*", (req, res, next) => {
  //Sends insecure http traffic to https server
  if (req.secure) {
    return next();
  } else {
    res.redirect(
      301,
      `https://${req.hostname}:${app.get("secPort")}${req.url}`
    );
  }
});


app.disable("x-powered-by"); //Hiding header that says it is Node/Express



app.use("/blog", blogRouter);
app.use("/users", usersRouter);
app.use(express.static(path.join(__dirname + "/public")));

app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
