const cors = require("cors");

const whitelist = [
  "http://localhost:3006",
  "https://localhost:3449",
  "https://localhost:3001",
  "https://localhost:3000",
  "http://localhost:3000",
  "http://curlybrackets.me",
  "https://curlybrackets.me",
  "http://192.168.1.26:3000",
];
const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
