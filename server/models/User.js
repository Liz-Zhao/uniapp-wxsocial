const mongoose = require('mongoose');
const { Schema } = mongoose;

const mongooseLeanVirtuals = require('mongoose-lean-virtuals');

require("dotenv").config();


const getRandomProfilePicture = `avatar.png`;

// follows  关注； following  粉丝

const userSchema = new Schema({
  username: String,
  openid:{type: String, select:false},
  description: { type: String, default: '' },
  profilePic: { type: String, default: getRandomProfilePicture },
  follows:{type:Number, default:0},
  follow:[{ type: Schema.Types.ObjectId, ref: "user" }],
  followings:{type:Number, default:0},
  following:[{ type: Schema.Types.ObjectId, ref: "user" }]
    // password: { type: String, select: false },
},{
  timestamps: true,
  toObject: { virtuals: true }, // 自动包含虚拟字段
  toJSON: { virtuals: true }
});

// 定义虚拟字段
userSchema.virtual('profilePicUrl').get(function () {
  return process.env.SEARVER_URL+ this.profilePic;
});

userSchema.plugin(mongooseLeanVirtuals);

const user = mongoose.model('user', userSchema);

module.exports = user;