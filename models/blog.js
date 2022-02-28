import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const commentSchema = new Schema(
  {
    text: {
      type: [String],
      required: true,
    },
    author: {
      type: String,
      required: true,
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
  },
  { timestamps: true }
);

const Blog = model("BlogEntry", blogSchema);

export default Blog;
