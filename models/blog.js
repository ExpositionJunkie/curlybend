const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//TODO populating user as the author on comments - is not working but have to take Ellie somewhere.

const commentSchema = new Schema(
  {
    text: {
      type: [String],
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const photoSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
    },
  },
  { timestamps: true }
);

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
    comments: [commentSchema],
    featured: {
      type: Boolean,
      default: false,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    photos: [photoSchema],
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
