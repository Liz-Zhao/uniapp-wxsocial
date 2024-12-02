const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    handler: { type: Schema.Types.ObjectId, ref: "user" },
    type:{type:String, enum: ['like','comment']},
    post:{type: Schema.Types.ObjectId, ref: "post" },
    comment:{type: Schema.Types.ObjectId, ref: "comment"}
  },
  {
    timestamps: true,
  }
);

const notification = mongoose.model("notification", notificationSchema);

module.exports = notification;
