const express = require("express");
const logger = require("morgan");
var createError = require("http-errors");

//Sessions
const session = require("express-session");
const FileStore = require("session-file-store")(session);

//Mongo Stuff
const mongoose = require("mongoose");

//Routes
const blogRouter = require("./routes/blogRouter");
const usersRouter = require('./routes/users')

//Mongo again
const url = "mongodb://127.0.0.1/blog";
const connect = mongoose.connect(url);

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

app.use(
  session({
    name: "session-id",
    secret: "12345-67890-09876-54321",
    saveUninitialized: false,
    resave: false,
    store: new FileStore(),
  })
);

app.use("/blog", blogRouter);
app.use('/users', usersRouter);

function auth(req, res, next) {
  console.log(req.session);

  if (!req.session.user) {
      const err = new Error('You are not authenticated!');
      err.status = 401;
      return next(err);
  } else {
      if (req.session.user === 'authenticated') {
          return next();
      } else {
          const err = new Error('You are not authenticated!');
          err.status = 401;
          return next(err);
      }
  }
}

app.use(auth);



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
