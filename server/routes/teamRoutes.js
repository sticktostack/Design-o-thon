const express = require("express");
const router = express.Router();
const {
  addTeam,
  getTeams,
  deleteTeam,
  teamLogin
} = require("../controllers/teamController");

router.post("/add", addTeam);
router.get("/all", getTeams);
router.delete("/delete/:id", deleteTeam);
router.post("/login", teamLogin);

module.exports = router;