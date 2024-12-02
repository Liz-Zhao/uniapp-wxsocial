const jwt = require("jsonwebtoken");
require("dotenv").config();

const isAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  // const token = authHeader;
  const token = authHeader && authHeader.split(" ")[1];


  if (token) {
    jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, decoded) => {
      // console.log(err, decoded)
      
      if (err)
        return res.status(401).json({ code: 401, message: "Session expired" });
      
      req.user = decoded.data;
      next();
    });
  }else{
    return res.status(500).json({code:500, message:"Auth is error!"})
  }


};
/**
 * {
  "decoded": {
    "data": {
      "_id": "6733193ca962081f22f3a77a",
      "username": "user_sglo-io5jSPRYBgnIJ5bQ",
      "openid": "",
      "description": "",
      "profilePic": "/assets/images/avatar.png",
      "createdAt": "2024-11-12T09:00:44.525Z",
      "updatedAt": "2024-11-12T09:00:44.525Z",
      "__v": 0
    },
    "iat": 1731464702
  }
}
 */

module.exports = { isAuth };
