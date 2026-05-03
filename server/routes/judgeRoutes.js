const express = require("express");
const router = express.Router();

const {
  addJudge,
  getJudges,
  deleteJudge,
  assignJudgeToTeam,
  judgeLogin,
  getJudgeAssignedTeams
} = require("../controllers/judgeController");

router.post("/add", addJudge);
router.get("/all", getJudges);
router.delete("/delete/:id", deleteJudge);
router.post("/assign-team", assignJudgeToTeam);
router.post("/login", judgeLogin);
router.get(
  "/assigned-teams/:judgeName",
  getJudgeAssignedTeams
);

module.exports = router;