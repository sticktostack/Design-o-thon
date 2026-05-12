const JudgeAssignment = require("../models/JudgeAssignment");
const Judge = require("../models/Judge");
const Team = require("../models/Team");
const Round = require("../models/round");
const createNotification = require("../utils/createNotification");

/*
==================================================
ASSIGN JUDGE TO TEAM + ROUND
FINAL FIX FOR assignedTeams VALIDATION ERROR
==================================================
*/
exports.assignJudge = async (req, res) => {
  try {
    const {
      judgeId,
      teamId,
      roundNumber
    } = req.body;

    /*
    ==========================================
    VALIDATION
    ==========================================
    */
    if (!judgeId || !teamId || !roundNumber) {
      return res.status(400).json({
        message: "Judge, Team and Round are required"
      });
    }

    /*
    ==========================================
    FIND JUDGE
    ==========================================
    */
    const judge = await Judge.findById(judgeId);

    if (!judge) {
      return res.status(404).json({
        message: "Judge not found"
      });
    }

    /*
    ==========================================
    FIND TEAM
    ==========================================
    */
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({
        message: "Team not found"
      });
    }

    /*
    ==========================================
    FIND ROUND
    ==========================================
    */
    const round = await Round.findOne({
      roundNumber: Number(roundNumber)
    });

    if (!round) {
      return res.status(404).json({
        message: "Round not found"
      });
    }

    /*
    ==========================================
    PREVENT DUPLICATE ASSIGNMENT
    ==========================================
    */
    const existingAssignment =
      await JudgeAssignment.findOne({
        judge: judgeId,
        team: teamId,
        roundNumber: Number(roundNumber)
      });

    if (existingAssignment) {
      return res.status(400).json({
        message:
          "Judge already assigned to this team for this round"
      });
    }

    /*
    ==========================================
    CREATE SEPARATE ASSIGNMENT DOCUMENT
    ==========================================
    */
    const assignment =
      await JudgeAssignment.create({
        judge: judgeId,
        team: teamId,
        roundNumber: Number(roundNumber)
      });

    /*
    ==========================================
    VERY IMPORTANT FIX:
    assignedTeams must store OBJECT
    not just teamId

    REQUIRED FORMAT:
    {
      team: teamId,
      roundNumber: roundNumber
    }
    ==========================================
    */
    const alreadyExists =
      judge.assignedTeams.some(
        (item) =>
          item.team &&
          item.team.toString() === teamId &&
          Number(item.roundNumber) === Number(roundNumber)
      );

    if (!alreadyExists) {
      judge.assignedTeams.push({
        team: teamId,
        roundNumber: Number(roundNumber)
      });

      await judge.save();
    }

    /*
    ==========================================
    SOCKET REFRESH
    ==========================================
    */
    if (global.io) {
      global.io.emit("judgeUpdated");
    }

    /*
    ==========================================
    NOTIFICATION
    ==========================================
    */
    await createNotification(
      "Judge Assigned",
      `${judge.name} assigned to ${team.teamName} for Round ${roundNumber}`,
      "judge"
    );

    res.status(201).json({
      message: "Judge assigned successfully",
      assignment
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message
    });
  }
};


/*
==================================================
GET ALL ASSIGNMENTS
==================================================
*/
exports.getAssignments = async (req, res) => {
  try {
    const assignments =
      await JudgeAssignment.find()
        .populate("judge", "name email expertise")
        .populate(
          "team",
          "teamName collegeName"
        )
        .sort({
          createdAt: -1
        });

    res.status(200).json(assignments);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/*
==================================================
UPDATE ASSIGNMENT
==================================================
*/
exports.updateAssignment = async (req, res) => {
  try {
    const {
      judgeId,
      roundNumber
    } = req.body;

    const assignment =
      await JudgeAssignment.findById(
        req.params.id
      );

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found"
      });
    }

    if (judgeId) {
      const newJudge =
        await Judge.findById(judgeId);

      if (!newJudge) {
        return res.status(404).json({
          message: "New judge not found"
        });
      }

      assignment.judge = newJudge._id;
    }

    if (roundNumber) {
      assignment.roundNumber =
        Number(roundNumber);
    }

    await assignment.save();

    if (global.io) {
      global.io.emit("judgeUpdated");
    }

    await createNotification(
      "Judge Reassigned",
      "Assignment updated successfully",
      "judge"
    );

    res.status(200).json({
      message:
        "Assignment updated successfully",
      assignment
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/*
==================================================
DELETE ASSIGNMENT
==================================================
*/
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment =
      await JudgeAssignment.findByIdAndDelete(
        req.params.id
      );

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found"
      });
    }

    if (global.io) {
      global.io.emit("judgeUpdated");
    }

    await createNotification(
      "Judge Assignment Removed",
      "Assignment deleted successfully",
      "judge"
    );

    res.status(200).json({
      message:
        "Assignment removed successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};