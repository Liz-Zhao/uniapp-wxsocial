const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");

const { getOpenID } = require("../controller/wxUser");

require("dotenv").config();

const updateUser = async (req, res) => {
  try {
    const { _id } = req.user;
    const { username, description, profilePic } = req.body;

    if (!_id) {
      return res.status(400).json({
        code: 404,
        message: "_id is lost.",
      });
    }

    if (description.length > 150)
      return res.status(400).json({
        code: 400,
        message: "Your description can't be longer than 150 characters",
      });

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { description: description, profilePic, username },
      { new: true, useFindAndModify: false }
    );

    return res.status(200).json({
      code: 200,
      message: "Description updated!",
      data: {
        newDescription: updatedUser.description,
        updatedUser: updatedUser.toObject(),
      },
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: "fail", error: error });
  }
};

const getUser = async (req, res) => {
  try {
    const { _id } = req.user;
    const { id } = req.params;

    if (!_id) {
      return res
        .status(401)
        .json({ code: 401, message: "user id is necessary!" });
    }

    const author = id ? id : _id;

    const savedUser = await User.findById({ _id: author }).populate("follow");

    return res.status(200).json({
      code: 200,
      message: "success",
      data: savedUser,
    });
  } catch (error) {
    return res.status(500).json({ code: 500, message: "fail", error: error.message || error.toString() });
  }
};

// 登录和注册
// 先检查是否已经存在，则登录，否则注册
const signin = async (req, res) => {
  try {
    const { code } = req.body;

    // 获取wx code
    const Open_data = await getOpenID(code);

    // 失败，报错
    if (Open_data.errcode) {
      return res.status(404).json({ code: 404, message: "code ID is error" });
    }

    // 数据库查询唯一 openid, 如果找到则已注册
    let user = await User.findOne({ openid: Open_data.openid });

    let savedUser;
    // 注册用户
    if (!user) {
      savedUser = await User.create({
        openid: Open_data.openid,
        // 自定义用户名称
        username: "user_" + nanoid(),
      });
    }
    else{
      savedUser = user
    }

    const token = jwt.sign({ data: savedUser }, process.env.SECRET_ACCESS_KEY);

    return res.status(200).json({
      code: 200,
      data: {
        token,
        ...savedUser.toObject(),
      },
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "fail",
      error: error.message || error.toString(),
    });
  }
};

const followUser = async(req,res)=>{
  try {
    const { _id } = req.user;
    const {id} = req.params;

    // 更新操作者
    await User.findByIdAndUpdate({_id},{$inc:{follows:1},$push:{follow:id} })
    // 更新被关注者，成为他的粉丝
    await User.findByIdAndUpdate({_id:id}, {$inc:{followings:1}, $push:{following:_id}})

    return res.status(200).json({code:200, message:'success'})

  } catch (error) {
    return res.status(500).json({ code: 500, message: "fail", error: error.message || error.toString() });
  }
}

const unfollowUser = async(req,res)=>{
  try {
    const { _id } = req.user;
    const {id} = req.params;

    // 更新操作者的关注列表，移除
    await User.findByIdAndUpdate({_id},{$inc:{follows:-1}, $pull:{follow:id} })
    // 更新被关注者，移除
    await User.findByIdAndUpdate({_id:id},{$inc:{followings:-1}, $pull:{following:_id}})

    return res.status(200).json({code:200, message:'success'})
    
  } catch (error) {
    return res.status(500).json({ code: 500, message: "fail", error: error.message || error.toString() });
  }
}


module.exports = {
  updateUser,
  getUser,
  signin,
  followUser,
  unfollowUser
};
