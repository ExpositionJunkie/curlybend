const cors = require("cors");

const whitelist = ["https://localohost:8080", "curlybrackets.me"];

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  console.log(req.header("Origin"));

  if (whitelist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = {
      origin: true,
      preflightContinue: true,
      allowedHeaders: "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
      methods: "GET, PUT, POST, DELETE, OPTIONS, HEAD, PATCH"
    };
  }else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);

      // allowedHeaders: ["Content-Type", "application/json"],
      // methods: "GET, PUT, POST, DELETE, OPTIONS",

