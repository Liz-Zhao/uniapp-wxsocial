const User = require("../controller/user");
const Post = require("../controller/post");
const {upload,uploadFile} = require("../controller/multer");
const Notification = require("../controller/notification");
const Comment = require("../controller/comment")
const { isAuth } = require("../controller/auth");

const router = require("express").Router();

router.post("/signin", User.signin);

// 用户 user
router.post("/user", isAuth, User.updateUser);
router.get("/user", isAuth, User.getUser);
router.get("/user/:id", isAuth, User.getUser);
router.post("/user/:id/follow",isAuth, User.followUser);
router.post("/user/:id/unfollow",isAuth, User.unfollowUser);

// 博客post
router.post("/post", isAuth, Post.createPost);
router.get("/post/:id", Post.getPost);
router.get("/posts", Post.getPosts);
router.post("/post/:id/like", isAuth, Post.likePost);
router.post("/post/:id/unlike", isAuth, Post.unlikePost);
router.delete("/post/:id", isAuth, Post.deletePost);
router.put("/post/:id", isAuth, Post.editPost);

// 文件上传
router.post(
  "/upload/file",
  isAuth,
  upload.single("file"),
  uploadFile
);

// 多传，最多9张
router.post("/photos/upload", 
  isAuth,
  upload.array("file", 9),
  uploadFile,
);

// 通知
router.get("/notifications", isAuth, Notification.getNotifications);

// 评论
router.post("/comment",isAuth, Comment.createComment);
router.delete("/comment/:id", isAuth,Comment.deleteComment)
router.get("/comments", Comment.getCommentsByPost )
router.get("/commentTree", Comment.getCommentTree )

module.exports = router;
