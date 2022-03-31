const cors = require("cors");

const whitelist = [
  /https:\/\/curlybrackets.me*/,
  /192.168.1.42*/,
  /fe80::59ae:bbcc:aa50:aeab%15*/,
  /https:\/\/localhost:^/,
  /https:\/\/localhost:*/,
  /https:\/\/localhost:3000*/,
  /https:\/\/localhost:3001*/,
  /https:\/\/localhost:8080\/#\/signup*/,
  /https:\/\/localhost\.herokuapp\.com\/*/,
  /https:\/\/curlybooty\.herokuapp\.com\/*/,
  /https:\/\/api.curlybrackets.me*/,
  /\w*\/\w*/,
  /\w*\/\w*\/*/,
  
];

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    console.log("got to cors options true");
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
