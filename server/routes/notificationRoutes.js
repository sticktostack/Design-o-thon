const express = require("express");
const router = express.Router();

const {
  createNotification,
  getNotifications,
  markAsRead
} = require("../controllers/notificationController");

router.post("/add", createNotification);
router.get("/all", getNotifications);
router.put("/read/:id", markAsRead);

module.exports = router;