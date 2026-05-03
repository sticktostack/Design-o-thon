const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  createSubmission,
  getSubmissions
} = require("../controllers/submissionController");


// PDF Upload Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post(
  "/add",
  upload.single("pdfFile"),
  createSubmission
);

router.get("/all", getSubmissions);

module.exports = router;