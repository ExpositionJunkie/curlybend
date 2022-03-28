const express = require("express");
const logger = require("morgan");
var createError = require("http-errors");
var path = require("path");
const passport = require("passport");
const mongoose = require("mongoose");

//Routes
const indexRouter = require("./routes/indexRouter");
const blogRouter = require("./routes/blogRouter");
const usersRouter = require("./routes/users");
const uploadRouter = require("./routes/uploadRouter");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
  console.log("development");
}

//Back to express
var app = express();

//Mongo
const connect = mongoose.connect(
  `mongodb+srv://${process.env.MONGOUSERNAME}:${process.env.MONGOPASSWORD}@booty2.nibmc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
);
connect
  .then(() => {
    console.log("Connected to db!");
    (err) => console.log(err);
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());

app.disable("x-powered-by"); //Hiding header that says it is Node/Express

app.use("/", indexRouter);
app.use("/blog", blogRouter);
app.use("/users", usersRouter);
app.use("/imageUpload", uploadRouter);

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
