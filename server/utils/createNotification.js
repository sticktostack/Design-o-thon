const Notification = require("../models/Notification");

const createNotification = async (
  title,
  message,
  type = "submission",
  uniqueKey = ""
) => {
  try {
    // Prevent duplicate notifications
    if (uniqueKey) {
      const existing = await Notification.findOne({
        uniqueKey
      });

      if (existing) {
        return;
      }
    }

    await Notification.create({
      title,
      message,
      type,
      uniqueKey
    });

  } catch (error) {
    console.log("Notification Error:", error.message);
  }
};

module.exports = createNotification;