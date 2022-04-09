const cors = require("cors");

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  console.log(req.header("Origin"));


    corsOptions = {
      origin: "*",
      preflightContinue: true,
      allowedHeaders: "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
      methods: "GET, PUT, POST, DELETE, OPTIONS, HEAD, PATCH"
    };


  callback(null, corsOptions);
};

exports.cors = cors({origin: "*",preflightContinue:true});
exports.corsWithOptions = cors(corsOptionsDelegate);

      // allowedHeaders: ["Content-Type", "application/json"],
      // methods: "GET, PUT, POST, DELETE, OPTIONS",

