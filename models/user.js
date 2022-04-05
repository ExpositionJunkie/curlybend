const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    maxLength: 320,
  },
  username: {
    type: String,
    default: 'Anonymous',
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

userSchema.plugin(passportLocalMongoose, {usernameField: "email"});

module.exports = mongoose.model("User", userSchema);
