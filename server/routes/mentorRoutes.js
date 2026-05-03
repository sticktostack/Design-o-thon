const express = require("express");
const router = express.Router();

const {
  addMentor,
  getMentors,
  deleteMentor,
  assignMentorToTeam
} = require("../controllers/mentorController");

router.post("/add", addMentor);
router.get("/all", getMentors);
router.delete("/delete/:id", deleteMentor);
router.post("/assign-team", assignMentorToTeam);

module.exports = router;