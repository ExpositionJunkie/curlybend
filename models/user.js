import { Schema as _Schema, model } from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const Schema = _Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    password: {
      type: String,
    },
    admin: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

const User = model("UserObject", userSchema);

module.exprots = User;
