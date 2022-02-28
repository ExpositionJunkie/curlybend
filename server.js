const express = require("express");
const logger = require("morgan");
var createError = require("http-errors");
const config = require("./config");

//Passport
const passport = require("passport");

//Mongo Stuff
const mongoose = require("mongoose");

//Routes
const blogRouter = require("./routes/blogRouter");
const usersRouter = require("./routes/users");

//Mongo again
const connect = mongoose.connect(config.mongoUrl);

connect.then(() => {
  console.log("Connected to blog server!");
  (err) => console.log(err);
});

//Back to express
const hostname = "localhost";
const port = 4500; //3000 reserved for front end dev

const app = express();
app.disable("x-powered-by"); //Hiding header that says it is Node/Express
app.use(logger("dev"));
app.use(express.json());

app.use(passport.initialize());

app.use("/blog", blogRouter);
app.use("/users", usersRouter);

app.use(express.static(__dirname + "/public"));

app.use((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/html");
  res.end(
    "<html><body><h1>This is the app get request test</h1></body></html>"
  );
});

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
