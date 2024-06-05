const Post = require("../models/post.js");
const User = require("../models/user.js");
const path = require("path");
const fs = require("fs");
const { Types } = require("mongoose");

const getPosts = async (req, res, next) => {
  try {
    const limit = req.query.limit;

    let posts;

    if (limit) {
      posts = await Post.find().limit(limit);
    } else {
      posts = await Post.find();
    }

    if (posts) {
      return res.status(200).json({
        success: true,
        posts: posts,
      });
    }

    res.status(200).json({
      success: false,
      post: "No Posts",
    });
  } catch (err) {
    res.status(500).json("Something went wrong");
  }
};

const getPost = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    if (!Types.ObjectId.isValid(postId)) {
      return res.status(200).json({
        success: false,
        post: "Invalid Id!",
      });
    }

    const post = await Post.findById(postId);

    if (post) {
      return res.status(200).json({
        success: true,
        post: post,
      });
    }

    res.status(200).json({
      success: false,
      post: `No Post with id: ${postId}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json("Something went wrong");
  }
};

const addPost = async (req, res, next) => {
  try {
    const image = req.file;

    if (!image) {
      return res.status(200).json({
        success: false,
        post: "Image Required",
      });
    }

    console.log(image);

    const { title, content } = req.body;
    const imageUrl = image.path;

    const post = Post({
      title: title,
      content: content,
      imageUrl: imageUrl,
      creator: req.userId,
    });

    await post.save();

    const user = await User.findById(req.userId);
    console.log(user);
    user.posts.push(post);

    await user.save();

    res.status(201).json({
      success: true,
      post: post,
      creator: { _id: user._id, name: user.name },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json("Something went wrong");
  }
};

const updatePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const { title, content } = req.body;
    const image = req.file;

    if (!Types.ObjectId.isValid(postId)) {
      return res.status(200).json({
        success: false,
        post: "Invalid Id!",
      });
    }

    const post = await Post.findById(postId);

    if (post) {
      if (post.creator.toString() !== req.userId) {
        return res.status(403).json({
          success: false,
          message: "Not Authorized!",
        });
      }

      if (title) post.title = title;

      if (content) post.content = content;

      if (image && image.path != imageUrl) {
        clearImage(post.imageUrl);
        post.imageUrl = image.path;
      }

      await post.save();

      return res.status(201).json({
        success: true,
        message: "Post Updated!",
        post: post,
      });
    }

    res.status(200).json({
      success: false,
      post: `No Post with id: ${postId}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json("Something went wrong");
  }
};

const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    if (!Types.ObjectId.isValid(postId)) {
      return res.status(200).json({
        success: false,
        post: "Invalid Id!",
      });
    }

    const post = await Post.findByIdAndDelete(postId);

    if (post) {
      if (post.creator.toString() !== req.userId) {
        return res.status(403).json({
          success: false,
          message: "Not Authorized!",
        });
      }
      const user = await User.findById(req.userId);
      user.pull(postId);
      await user.save();

      clearImage(post.imageUrl);
      return res.status(201).json({
        success: true,
        message: "Post Deleted!",
      });
    }

    res.status(200).json({
      success: false,
      post: `No Post with id: ${postId}`,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json("Something went wrong");
  }
};

const clearImage = (filePath) => {
  filePath = path.join(path.resolve(), filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

module.exports = { getPosts, getPost, addPost, updatePost, deletePost };
