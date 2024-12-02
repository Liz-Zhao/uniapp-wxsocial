const Post = require("../models/Post");
const Notification = require("../models/Notification");
require("dotenv").config();

const createPost = async (req, res) => {
  try {
    const { message, images } = req.body;
    const { _id: author } = req.user;

    let query = {};

    if (message) {
      query.message = message;
    }

    if (images) {
      query.images = images;
    }

    if (author) {
      query.author = author;
    } else {
      return res.status(500).json({ message: "token is wrong!" });
    }

    await Post.create(query);

    return res.status(200).json({ code: 200, message: "success" });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "something is happen.",
      error: error.message || error.toString(),
    });
  }
};

const getPost = async (req, res) => {
  try {
    const { id } = req.params;

    const existedPost = await Post.findById(id).populate("author");

    if (!existedPost) {
      return res.status(404).json({ code: 404, message: "Post not found" });
    }

    return res.status(200).json({ code: 200, data: existedPost });
  } catch (error) {
    return res.status(500).json({ message: "Unexpected error." });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    await Post.findOneAndDelete({
      _id: id,
      $or: [{ author: req.user._id }, { profile: req.user.username }],
    });
    return res.status(200).json({ code: 200, message: "Post deleted" });
  } catch (error) {
    res.status(500).json({
      code: 500,
      error: error,
      message: "There was an error deleting the post.",
    });
  }
};

const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, images } = req.body;
    const { _id: author } = req.user;

    const existedPost = await Post.findById(id);
    if (!existedPost)
      return res
        .status(400)
        .json({ code: 400, message: "can't find the blog!" });

    const newPost = await Post.findByIdAndUpdate(
      { _id: id, author },
      { message, images }
    );

    return res
      .status(200)
      .json({ code: 200, message: "success", data: newPost });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      error: error,
      message: "There was an error edit the post.",
    });
  }
};

const getPosts = async (req, res) => {
  try {
    const { author, limit, page } = req.query;

    let pageSize = limit ? limit : 10;
    let pageIndex = page ? page : 1;

    let query = {};

    if (author) {
      query.author = author;
    }

    const result = await Post.find(query)
      .populate({
        path: "author",
      })
      .limit(pageSize)
      .skip((pageIndex - 1) * pageSize);

    const count = await Post.countDocuments(query);

    return res.status(200).json({
      code: 200,
      counts: count,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "fail",
      error: error.message || error.toString(),
    });
  }
};

const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user) {
      return res
        .status(403)
        .json({ code: 403, response: "Unauthorized request" });
    }

    const query = {
      _id: id,
      likedBy: {
        $nin: req.user._id,
      },
    };

    const newValues = {
      $push: {
        likedBy: req.user._id,
      },
      $inc: {
        likes: 1,
      },
    };
    const likedPost = await Post.findOneAndUpdate(query, newValues, {
      new: true,
    });

    if (!likedPost) {
      return res
        .status(403)
        .json({ code: 403, message: "You already liked this post" });
    }

    await Notification.create({
      handler: req.user._id,
      type: "like",
      post: id,
    });

    return res.status(200).json({ code: 200, message: "success" });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "There were an error on like a post",
      error: error.message || error.toString(),
    });
  }
};

const unlikePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.user)
      res.status(403).json({ code: 403, response: "Unauthorized request" });

    const query = {
      _id: id,
      likedBy: {
        $in: req.user._id,
      },
    };

    const newValues = {
      $pull: {
        likedBy: req.user._id,
      },
      $inc: {
        likes: -1,
      },
    };

    const unlikedPost = await Post.findOneAndUpdate(query, newValues, {
      new: true,
    });

    if (!unlikedPost) {
      return res.status(403).json({ code: 403, message: "此前无点赞记录" });
    }

    await Notification.findOneAndDelete({
      handler: req.user._id,
      type: "like",
      post: id,
    });

    return res.status(200).json({ code: 200, message: "success" });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "There were an error on dislike post",
      error: error.message || error.toString(),
    });
  }
};

module.exports = {
  createPost,
  getPost,
  getPosts,
  likePost,
  unlikePost,
  deletePost,
  editPost,
};
