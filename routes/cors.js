const cors = require("cors");



const whitelist = [
  /https:\/\/curlybrackets.me*/,
  /192.168.1.42*/,
  /fe80::59ae:bbcc:aa50:aeab%15*/,
  /http:\/\/localhost:*/, 
  /https:\/\/localhost\.herokuapp\.com\/*/,
  /https:\/\/curlybooty\.herokuapp\.com\/*/,
  /https:\/\/api.curlybrackets.me*/
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
