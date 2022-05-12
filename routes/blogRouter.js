const express = require("express");
const Blog = require("../models/blog");
const blogRouter = express.Router();
const authenticate = require("../authenticate");
const cors = require("./cors");

blogRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Blog.find()
      .sort({ _id: -1 })
      .populate("author")
      .populate("comments.author")
      .then((blogs) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(blogs);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    req.body.author = req.user._id;
    Blog.create(req.body)
      .then((blog) => {
        console.log("Blog Created", blog);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(blog);
      })
      .catch((err) => next(err));
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(
      "PUT operation not supported on /blog - please add your entry at blog/blogID instead."
    );
  })
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin, //delete all blogs allowed only to admin
    (req, res, next) => {
      Blog.deleteMany()
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

blogRouter
  .route("/:blogId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Blog.findById(req.params.blogId)
      .populate("author")
      .populate("comments.author")
      .then((blog) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(blog);
      })
      .catch((err) => next(err));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end(`POST operation not supported on /blogs/${req.params.blogId}`);
    }
  )
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Blog.findByIdAndUpdate(
      req.params.blogId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((blog) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(blog);
      })
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    // only user can delete their blog entry
    Blog.findById(req.params.blogId)
      .then((blog) => {
        if (blog.author._id == req.user.id) {
          blog
            .deleteOne({ _id: req.params.blogId })
            .then((response) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(response);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(
            `Blog ${req.params.blogId} was not written by user ${req.user.id} - operation is forbidden.`
          );
          err.status = 403;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

blogRouter
  .route("/:blogId/comments")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Blog.findById(req.params.blogId)
      .populate("author")
      .populate("comments.author")
      .then((blog) => {
        if (blog) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(blog.comments);
        } else {
          err = new Error(`Blog ${req.params.blogId} not found.`);
          err.staus = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Blog.findById(req.params.blogId)
      .then((blog) => {
        if (blog) {
          req.body.author = req.user._id;
          blog.comments.push(req.body);
          blog
            .save()
            .then((blog) => {
              res.stausCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(blog);
            })
            .catch((err) => next(err));
        } else {
          err = new Error(`Blog ${req.params.blogId} not found.`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end(
        `Put operation not supported on /blog/${req.params.blogId}/comments. Try going to the individual comment instead!`
      );
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      //delete of all comments only allowed by admin.
      Blog.findById(req.params.blogId)
        .then((blog) => {
          if (blog) {
            for (let i = blog.comments.length - 1; i >= 0; i--) {
              blog.comments.id(blog.comments[i]._id).remove();
            }
            blog
              .save()
              .then((blog) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(blog);
              })
              .catch((err) => next(err));
          } else {
            err = new Error(`Blog ${req.params.blogId} not found.`);
            err.status = 404;
            return next(err);
          }
        })
        .catch((err) => next(err));
    }
  );

blogRouter
  .route("/:blogId/comments/:commentId")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Blog.findById(req.params.blogId)
      .populate("author")
      .populate("comments.author")
      .then((blog) => {
        if (blog && blog.comments.id(req.params.commentId)) {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(blog.comments.id(req.params.commentId));
        } else if (!blog) {
          err = new Error(`Blog ${req.params.blogId} not found.`);
          err.status = 404;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.commentId} not found.`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403;
      res.end(
        `POST operation not supported on /blog/${req.params.blogId}/comments/${req.params.commentId}`
      );
    }
  )
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Blog.findById(req.params.blogId)
      .then((blog) => {
        if (blog && blog.comments.id(req.params.commentId)) {
          //will need to add additional ifs as comment features added.
          //Emojis eventually? Photos too perhaps.
          //But let's keep this simple for right now.
          if (req.body.text) {
            blog.comments.id(req.params.commentId).text = req.body.text;
          }
          blog
            .save()
            .then((blog) => {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.json(blog);
            })
            .catch((err) => next(err));
        } else if (!blog) {
          err = new Error(`Blog ${req.params.blogId} not found.`);
          err.status = 404;
          return next(err);
        } else {
          err = new Error(`Comment ${req.params.commentId} not found.`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    //only user may delete their own comments
    Blog.findById(req.params.blogId)
      .then((blog) => {
        if (blog && blog.comments.id(req.params.commentId)) {
          if (
            blog.comments.id(req.params.commentId).author._id == req.user.id
          ) {
            blog.comments.id(req.params.commentId).remove();
            blog
              .save()
              .then((blog) => {
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(blog);
              })
              .catch((err) => next(err));
          } else {
            err = new Error(
              `Blog ${req.params.commentId} was not written by user ${
                req.user.id
              } but was written by user ${
                blog.comments.id(req.params.commentId).author._id
              } - operation is forbidden.`
            );
            err.status = 403;
            return next(err);
          }
        } else if (!blog) {
          err = new Error(`Blog ${req.params.blogId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

blogRouter
  .route("/tags/:tagname")
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    Blog.find({ tags: { $in: [req.params.tagname] } })
      .populate("author")
      .populate("comments.author")
      .then((blogs) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(blogs);
      })
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST operation not supported on /blog/tags/:tagid.");
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /blog/tags/:tagid.");
  })
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      res.statusCode = 403;
      res.end("DELETE operation not supported on /blog/tags/:tagid.");
    }
  );

module.exports = blogRouter;
