const express = require("express");
const morgan = require("morgan");
//Mongo Stuff
const mongoose = require("mongoose");
//Routes
const blogRouter = require("./routes/blogRouter");
const userRouter = require('./routes/usersRouter')
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

app.use("/blog", blogRouter);
app.use("/users", userRouter);

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
