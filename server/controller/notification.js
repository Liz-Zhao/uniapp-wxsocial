const Notification = require("../models/Notification");
require("dotenv").config();


/**
 * 查看个人的通知和消息
 *
 */
const getNotifications = (req, res) => {
  const { _id } = req.user;
  // const { limit, page } = req.query;
  const queryObj = { ...req.query };
  const excludedFields = ['page','limit'];

  excludedFields.forEach((el) => delete queryObj[el]);

  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);
  // console.log(JSON.parse(queryStr));


  let query = {
    handler: _id,
    ...JSON.parse(queryStr)
  };

  // console.log(query)

  Notification.countDocuments(query)
    .then(() => {
      return Notification.find(query)
        .limit(10)
        .skip(0)
        .populate("handler")
        .populate("post").populate("comment").lean();
    })
    .then((result) => {

      res.status(200).json({
        code: 200,
        data: result.map(item=>{
          return {
            ...item,
            handler:{
              ...item.handler,
              profilePic: process.env.SEARVER_URL+ item.handler.profilePic
            },
          }
        }),
      });
    })
    .catch((error) => {
      res.status(500).json({ code: 500, message: "fail", error:  error.message || error.toString(), });
    });
};

module.exports = {
  getNotifications,
};
