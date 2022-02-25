const express = require("express");
const morgan = require("morgan");
const blogRouter = require("./routes/blogRouter");

const hostname = "localhost";
const port = 4500; //3000 reserved for front end dev

const app = express();
app.disable("x-powered-by"); //Hiding header that says it is Node/Express
app.use(morgan("dev"));
app.use(express.json());

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
