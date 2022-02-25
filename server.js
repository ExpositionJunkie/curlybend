const express = require("express");
const morgan = require("morgan");

const hostname = "localhost";
const port = 4500; //3000 reserved for front end dev

const app = express();
app.disable("x-powered-by"); //Don't like people to see what technology my backend is running. That's why we hide it!
app.use(morgan("dev"));
app.use(express.json());

app.all("/blog", (req, res, next) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  next();
});

app.get("/blog", (req, res) => {
  res.end("Will send all the blog data to you");
});

app.put("/blog", (req, res) => {
  res.statusCode = 403;
  res.end(
    "PUT operation not supported on /blog. This must be done through individual blog entry."
  );
});

app.post("/blog", (req, res) => {
  res.send(
    `Will add the blog entry - id: ${req.body.blogId}, date: ${req.body.date} title: ${req.body.title}, Subtitle: ${req.body.subtitle}, text:${req.body.text} `
  );
});

app.delete("/blog", (req, res) => {
  res.end("This would delete the entire blog. Not just an entry.");
});

app.get("/blog/:blogId", (req, res) => {
  res.end(`Will send details of the blog entry: ${req.params.blogId} to you`);
});

app.post("/blog/:blogId", (req, res) => {
  res.statusCode = 403;
  res.end(`POST operation not supported on /blog/${req.params.blogId}`);
});

app.put("/blog/:blogId", (req, res) => {
  res.write(`Updating the blog entry: ${req.params.blogId}\n`);
  res.end(`Will update the blog entry: ${req.body.name}
        with text: ${req.body.text}`);
});

app.delete("/blog/:blogId", (req, res) => {
  res.end(`Deleting blog entry: ${req.params.blogId}`);
});

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
