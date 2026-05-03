const Notification = require("../models/Notification");
const createNotification = require("../utils/createNotification");


// Create Notification
exports.createNotification = async (req, res) => {
  try {
    const {
      title,
      message,
      type
    } = req.body;

    const notification = await Notification.create({
      title,
      message,
      type
    });

    res.status(201).json({
      message: "Notification created",
      notification
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Get All Notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json(notifications);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Mark as Read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndUpdate(id, {
      isRead: true
    });

    res.status(200).json({
      message: "Notification marked as read"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};