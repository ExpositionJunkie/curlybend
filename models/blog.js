const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    date: Date,
    title: {
      type: String,
      required: true,
      unique: false,
    },
    subtitle: {
      type: String,
      required: false,
      unique: false,
    },
    text: [String],
    tags: [String],
  },
  { timestamps: true }
);

const Blog = mongoose.model("BlogEntry", blogSchema);

module.exports = Blog;
