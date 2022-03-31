const cors = require("cors");

// const whitelist = [
//   /https:\/\/curlybrackets.me*/,
//   /192.168.1.42*/,
//   /fe80::59ae:bbcc:aa50:aeab%15*/,
//   /https:\/\/localhost:^/,
//   /https:\/\/localhost:*/,
//   /https:\/\/localhost:3000*/,
//   /https:\/\/localhost:3001*/,
//   /https:\/\/localhost:8080\/#\/signup*/,
//   /https:\/\/localhost\.herokuapp\.com\/*/,
//   /https:\/\/curlybooty\.herokuapp\.com\/*/,
//   /https:\/\/api.curlybrackets.me*/,
//   /\w*\/\w*/,
//   /\w*\/\w*\/*/,

// ];

const whitelist = ["https://localohost:8080", "curlybrackets.me"];

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;

  corsOptions = {
    origin: "*",
    methods: ["GET", "HEAD", "PUT", "POST", "DELETE"],
    preflightContinue: true,
    optionsSuccessStatus: 200,
    credentials: true,
  };
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);
