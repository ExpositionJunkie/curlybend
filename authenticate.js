import { use, serializeUser, deserializeUser, authenticate } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { authenticate as _authenticate, serializeUser as _serializeUser, deserializeUser as _deserializeUser, findOne } from "./models/user.js";
import { secretKey } from "./config.js";
import { Strategy as JwtStrategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import { sign } from "jsonwebtoken";

export const local = use(new LocalStrategy(_authenticate()));
serializeUser(_serializeUser());
deserializeUser(_deserializeUser());

//You can change the expiry time of the token.
//Set currently for 1 hour
export function getToken(user) {
  return sign(user, secretKey, { expiresIn: 3600 });
}

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = secretKey;

export const jwtPassport = use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    findOne({ _id: jwt_payload._id }, (err, user) => {
      if (err) {
        return done(err, false);
      } else if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        //TODO need to set up way to route to login screen here in the future.
      }
    });
  })
);

export const verifyUser = authenticate("jwt", { session: false });

export function verifyAdmin(req, res, next) {
  if (req.user.admin) {
    return next();
  } else {
    console.log("req.user.admin in authenticate.verifyAdmin", req.user.admin);
    const err = new Error("You are not authorized to perorm this operation!");
    err.status = 403;
    return next(err);
  }
}
