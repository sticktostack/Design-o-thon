const express = require("express");
const router = express.Router();

const {
  registerAdmin,
  loginAdmin,
  getAnalytics
} = require("../controllers/adminController");

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

router.get("/analytics", getAnalytics);


module.exports = router;