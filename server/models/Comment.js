const mongoose = require('mongoose');
const { Schema } = mongoose;


/**
 * 
评论的类型，细分的话，可以分为 3 类：

- 直接对文章发表评论，pid 与 replyid 为空；
- 对一级评论进行回复，pid 与 replyid 均为一级评论的 id;
- 对楼中楼进行回复，pid 为一级评论的 id，replyid 为你回复的评论的 id

_id 评论原有的主键id
replyid 该评论回复的评论id
pid 该评论所在的父级id
post 文字的标识id
*/

const commentSchema = new Schema({
  user:{type: Schema.Types.ObjectId, ref: "user"},
  message:{type:String,default:null},
  replyid:{type: Schema.Types.ObjectId, ref: "comment"},
  pid:{type: Schema.Types.ObjectId, ref: "comment"},
  post:{type: Schema.Types.ObjectId, ref: "post"},
  isDeleted: { type: Boolean, default: false }, // 标记是否已删除
},{
  timestamps: true,
});




const user = mongoose.model('comment', commentSchema);

module.exports = user;