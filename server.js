const express = require("express");
const morgan = require("morgan");

//Mongo Stuff
const mongoose = require("mongoose");

//Routes
const blogRouter = require("./routes/blogRouter");

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
app.use(morgan("dev"));
app.use(express.json());

function auth(req, res, next) {
  console.log(req.headers);
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    const err = new Error("You are not authenticated!");
    res.setHeader("WWW-Authenticate", "Basic");
    err.status = 401;
    return next(err);
  }

  const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  const user = auth[0];
  const pass = auth[1];
  if (user === 'admin' && pass === "password") {
    return next(); //authorized
  } else {
    const err = new Error('You are not authenticated!');
    res.setHeader('WWW-Authenticate', 'Basic')
    err.status = 401;
    return next(err);
  }
}

app.use(auth);

app.use("/blog", blogRouter);

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
