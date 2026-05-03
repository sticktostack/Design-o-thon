const express = require("express");
const router = express.Router();

const {
  assignJudge,
  getAssignments,
  updateAssignment,
  deleteAssignment
} = require("../controllers/judgeAssignmentController");


/*
==================================================
ASSIGN JUDGE TO TEAM + ROUND
==================================================
*/
router.post("/assign", assignJudge);


/*
==================================================
GET ALL ASSIGNMENTS
==================================================
*/
router.get("/all", getAssignments);


/*
==================================================
UPDATE ASSIGNMENT (REASSIGN)
==================================================
*/
router.put("/update/:id", updateAssignment);


/*
==================================================
DELETE ASSIGNMENT
==================================================
*/
router.delete("/delete/:id", deleteAssignment);


module.exports = router;