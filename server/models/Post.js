const mongoose = require("mongoose");
const { Schema } = mongoose;
require("dotenv").config();

const ExtraTypeSchema = new Schema({
  // image, viedo
  media:{type:String,enum:['image','video']},
  value:[String]

});

const postSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "user" },
  message: {type:String, default:null},
  images:{type:[String], default:null},
  likes: { type: Number, default: 0 },
  likedBy: [{ type: Schema.Types.ObjectId, ref: "user" }],
  comments:{ type: Number, default: 0 },
  // extra: {
  //   // 嵌套子Schema
  //   type: ExtraTypeSchema,
  //   default:null,
  // },
},{
    timestamps: true,
    toObject: { virtuals: true }, // 自动包含虚拟字段
    toJSON: { virtuals: true }
  });

// 定义虚拟字段
postSchema.virtual('imagesUrl').get(function () {
    return this.images.map((item)=> process.env.SEARVER_URL+item);
});


const post = mongoose.model("post", postSchema);

module.exports = post;
