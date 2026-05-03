const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["submission", "score", "leaderboard", "round", "judge", "mentor"],
      default: "submission",
    },
    uniqueKey: {
      type: String,
      default: "",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports =
  mongoose.models.isReadNotification ||
  mongoose.model("Notification", notificationSchema);
