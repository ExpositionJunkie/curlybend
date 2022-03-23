const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}


exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//May want to set this longer in the future is for an hour right now.
exports.getToken = (user) => {
  return jwt.sign(user, process.env.SECRETKEY, { expiresIn: 3600 });
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRETKEY;

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT Payload: ', jwt_payload);
            User.findOne({_id: jwt_payload._id}, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            })
        }
    )
)

exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
      return next();
    } else {
      console.log("req.user.admin in authenticate.verifyAdmin", req.user.admin);
      const err = new Error("You are not authorized to perorm this operation!");
      err.status = 403;
      return next(err);
    }
  };
  

exports.verifyUser = passport.authenticate('jwt', {session: false})