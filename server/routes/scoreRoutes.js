const express = require("express");
const router = express.Router();

const {
  giveScore,
  getScores,
  getLeaderboard,
  announceFinalWinner
} = require("../controllers/scoreController");

router.post("/add", giveScore);
router.get("/all", getScores);
router.get("/leaderboard", getLeaderboard);
// router.post("/qualification-result", sendQualificationResult);
router.post("/announce-winner", announceFinalWinner);

module.exports = router;
