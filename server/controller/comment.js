const Post = require("../models/Post");
const Notification = require("../models/Notification");
const Comment = require("../models/Comment");

require("dotenv").config();


const createComment = async (req, res) => {
  try {
    const { pid, message, post_id, replyid } = req.body;
    const { _id } = req.user;

    if (!_id || !message || !post_id) {
      return res
        .status(400)
        .json({ code: 400, message: "用户、评论内容和文章 ID 是必须的。" });
    }

    const query = {
      pid: pid || null,
      message,
      post_id,
      replyid: replyid || null,
      user: _id,
      post: post_id,
    };

    const newComment =await Comment.create(query);
    await Post.findByIdAndUpdate({ _id: post_id }, { $inc: { comments: 1 } });
    await Notification.create({handler:_id, type:'comment', post:post_id, comment:newComment._id})

    return res.status(200).json({ code: 200, message: "success",data:newComment });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      error: error.message || error.toString(),
      message: "There was an error create the post.",
    });
  }
};

const getCommentsByPost = async (req, res) => {
  try {
    const { post_id, limit, page } = req.query;

    let pageSize = limit ? limit : 10;
    let pageIndex = page ? page : 1;

    if (!post_id) {
      return res.status(400).json({ code: 400, message: "文章 ID 是必须的。" });
    }

    // 获取一级评论（没有父级 pid） 
    // 一级评论如果被删，回复的评论也就不显示了
    const topLevelComments = await Comment.find({ post: post_id, pid: null, isDeleted:false })
      .populate("user", "username profilePic profilePicUrl")
      .sort({ createdAt: -1 }) // 最新评论在前
      .skip((pageIndex - 1) * pageSize)
      .limit(Number(pageSize))
      .lean({ virtuals: true });

    const topLevelCommentCounts = await Comment.countDocuments({ post: post_id, pid: null, isDeleted:false })

    // 构建楼中楼评论
    const commentMap = {};
    for (let comment of topLevelComments) {
        // 处理已被删除的一级评论
        // if(comment.isDeleted){
        //     comment={
        //         ...comment,
        //         message:"该评论已被删除",
        //         user:null
        //     }
        // }

      // 获取楼中楼的子评论
      const replies = await Comment.find({ pid: comment._id, isDeleted:false})
        .populate("user", "username profilePic profilePicUrl")
        .sort({ createdAt: 1 })
        .limit(3) // 按时间排序
        .lean({ virtuals: true });

      const replyCounts = await Comment.countDocuments({pid: comment._id, isDeleted:false});

      // 获取每条子评论的 `replyid` 信息
      for (const reply of replies) {

        // console.log(reply.replyid ,comment._id,String(reply.replyid) !== String(comment._id))
        // 评论id 不等于 一级评论的id,则说明是回复其它的评论
        if (String(reply.replyid) !== String(comment._id)) {
            reply.replyTo = await Comment.findById(reply.replyid)
            .populate("user", "username profilePic profilePicUrl")
            .lean({ virtuals: true });

            if(reply.replyTo.isDeleted){
                reply.replyTo = {
                    ...reply.replyTo,
                    message:'该评论被删除',
                    user:null
                }
            }
        }
      }

      // 将子评论挂载到一级评论下
      commentMap[comment._id] = { ...comment, replies, replyCounts };
    }

    // console.log(commentMap)

    return res
      .status(200)
      .json({ code: 200, message: "success",counts:topLevelCommentCounts, data: Object.values(commentMap) });

  } catch (error) {
    return res.status(500).json({
      code: 500,
      error: error.message || error.toString(),
      message: "There was an error on query the post.",
    });
  }
};



const getComment = async (req, res) => {
  try {
    const { post_id, pid,limit,page} = req.query;

    let pageSize = limit ? limit : 10;
    let pageIndex = page ? page : 1;

    // 获取该文章的所有评论
    const allComments = await Comment.find({ post: post_id, pid })
      .populate("user","username profilePic profilePicUrl")
      .skip(3+(pageIndex -1)*pageSize) // 前3个默认显示，所以从第4个开始获取
      .limit(Number(pageSize))
      .lean({ virtuals: true });

    // 数量
    const Counts = await Comment.countDocuments({ post: post_id, pid })

    for(const reply of allComments){
      if(String(reply.replyid) !== String(pid)){
        reply.replyTo = await Comment.findById(reply.replyid)
            .populate("user", "username profilePic profilePicUrl")
            .lean({ virtuals: true });


        if(reply.replyTo.isDeleted){
          reply.replyTo = {
              ...reply.replyTo,
              message:'该评论被删除',
              user:null
          }
      }
      }
    }

    return res.status(200).json({code: 200, message: "success", counts:Counts,data: allComments });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      error: error.message || error.toString(),
      message: "There was an error query the post.",
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const delCom = await Comment.findByIdAndUpdate({
      _id: id,
      user: req.user._id,
    },{isDeleted:true});

    await Post.findByIdAndUpdate({ _id: delCom.post }, { $inc: { comments: -1 } });

    return res.status(200).json({ code: 200, message: "Comment deleted" });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      error: error.message || error.toString(),
      message: "There was an error delete the post.",
    });
  }
};

module.exports = {
  createComment,
  getCommentsByPost,
  getComment,
  deleteComment,
};
