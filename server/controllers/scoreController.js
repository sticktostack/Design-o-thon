const Score = require("../models/Score");
const JudgeAssignment = require("../models/JudgeAssignment");
const Judge = require("../models/judge");
const Team = require("../models/team");
const Round = require("../models/round");
const Submission = require("../models/submission");
const createNotification = require("../utils/createNotification");
const sendEmail = require("../utils/sendEmail");

/*
==================================================
LEADERBOARD (ROUND-WISE FIXED)
==================================================
*/
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Score.aggregate([
      /*
      ==========================================
      JOIN ROUND DATA
      ==========================================
      */
      {
        $lookup: {
          from: "rounds",
          localField: "round",
          foreignField: "_id",
          as: "roundData"
        }
      },
      { $unwind: "$roundData" },

      /*
      ==========================================
      GROUP BY TEAM + ROUND
      → CALCULATE AVERAGE (🔥 FIX)
      ==========================================
      */
      {
        $group: {
          _id: {
            team: "$team",
            roundNumber: "$roundData.roundNumber"
          },
          avgScore: {
            $avg: "$scores.totalScore"
          }
        }
      },

      /*
      ==========================================
      GROUP BY TEAM
      ==========================================
      */
      {
        $group: {
          _id: "$_id.team",
          rounds: {
            $push: {
              roundNumber: "$_id.roundNumber",
              score: "$avgScore"
            }
          }
        }
      },

      /*
      ==========================================
      CALCULATE FINAL TOTAL (SUM OF AVERAGES)
      ==========================================
      */
      {
        $addFields: {
          totalScore: {
            $sum: "$rounds.score"
          }
        }
      },

      /*
      ==========================================
      SORT
      ==========================================
      */
      {
        $sort: {
          totalScore: -1
        }
      }
    ]);

    /*
    ==========================================
    POPULATE TEAM DETAILS
    ==========================================
    */
    const populated = await Team.populate(leaderboard, {
      path: "_id",
      select: "teamName collegeName"
    });

    /*
    ==========================================
    FINAL FORMAT
    ==========================================
    */
    const finalLeaderboard = populated.map((team) => {
      let round1 = 0;
      let round2 = 0;
      let round3 = 0;

      team.rounds.forEach((r) => {
        if (Number(r.roundNumber) === 1) round1 = r.score;
        if (Number(r.roundNumber) === 2) round2 = r.score;
        if (Number(r.roundNumber) === 3) round3 = r.score;
      });

      return {
        teamName: team._id?.teamName || "-",
        collegeName: team._id?.collegeName || "-",

        round1: Math.round(round1),
        round2: Math.round(round2),
        round3: Math.round(round3),

        totalScore: Math.round(team.totalScore || 0)
      };
    });

    res.status(200).json(finalLeaderboard);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
==================================================
GIVE SCORE (🔥 FINAL VERSION WITH ROUND LIMITS)
==================================================
*/
exports.giveScore = async (req, res) => {
  try {
    const {
      judgeName,
      teamName,
      roundName,
      uxLogic,
      uiAesthetics,
      innovation,
      feasibilityAccessibility,
      presentation,
      feedback,
    } = req.body;

    /*
    ==========================================
    REQUIRED FIELDS
    ==========================================
    */
    if (!judgeName || !teamName || !roundName) {
      return res.status(400).json({
        message: "judgeName, teamName and roundName are required",
      });
    }

    const safeJudgeName = String(judgeName).trim();
    const safeTeamName = String(teamName).trim();
    const safeRoundName = String(roundName).trim();

    /*
    ==========================================
    FIND JUDGE
    ==========================================
    */
    const judge = await Judge.findOne({ name: safeJudgeName });
    if (!judge) {
      return res.status(404).json({ message: "Judge not found" });
    }

    /*
    ==========================================
    FIND TEAM
    ==========================================
    */
    const team = await Team.findOne({ teamName: safeTeamName });
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    /*
    ==========================================
    FIND ROUND (Flexible)
    ==========================================
    */
    let round = await Round.findOne({ roundName: safeRoundName });

    if (!round) {
      const num = parseInt(safeRoundName.replace("Round", "").trim());
      if (!isNaN(num)) {
        round = await Round.findOne({ roundNumber: num });
      }
    }

    if (!round) {
      return res.status(404).json({ message: "Round not found" });
    }

    /*
    ==========================================
    ROUND CLOSED CHECK
    ==========================================
    */
    if (round.status && String(round.status).toLowerCase() === "closed") {
      return res.status(400).json({
        message: "Leaderboard is frozen. Round is closed.",
      });
    }

    /*
    ==========================================
    ROUND NUMBER
    ==========================================
    */
    let roundNumber = round.roundNumber;

    if (!roundNumber) {
      const extracted = parseInt(safeRoundName.replace("Round", "").trim());
      if (!isNaN(extracted)) {
        roundNumber = extracted;
      }
    }

    /*
    ==========================================
    ROUND-WISE LIMITS
    ==========================================
    */
    let limits = {};

    if (roundNumber === 1 || roundNumber === 2) {
      limits = {
        total: 25,
        uxLogic: 8,
        uiAesthetics: 8,
        innovation: 5,
        feasibilityAccessibility: 2,
        presentation: 2,
      };
    } else if (roundNumber === 3) {
      limits = {
        total: 50,
        uxLogic: 15,
        uiAesthetics: 15,
        innovation: 10,
        feasibilityAccessibility: 5,
        presentation: 5,
      };
    } else {
      return res.status(400).json({
        message: "Invalid round configuration",
      });
    }

    /*
    ==========================================
    VALIDATE INDIVIDUAL LIMITS
    ==========================================
    */
    if (
      Number(uxLogic) > limits.uxLogic ||
      Number(uiAesthetics) > limits.uiAesthetics ||
      Number(innovation) > limits.innovation ||
      Number(feasibilityAccessibility) > limits.feasibilityAccessibility ||
      Number(presentation) > limits.presentation
    ) {
      return res.status(400).json({
        message: "Scores exceed allowed criteria limits for this round",
      });
    }

    /*
    ==========================================
    TOTAL SCORE
    ==========================================
    */
    const totalScore =
      Number(uxLogic) +
      Number(uiAesthetics) +
      Number(innovation) +
      Number(feasibilityAccessibility) +
      Number(presentation);

    /*
    ==========================================
    TOTAL LIMIT CHECK
    ==========================================
    */
    if (totalScore > limits.total) {
      return res.status(400).json({
        message: `Total score cannot exceed ${limits.total} for this round`,
      });
    }

    /*
    ==========================================
    CHECK SUBMISSION (MATCH ROUND)
    ==========================================
    */
    const submission = await Submission.findOne({
      team: team._id,
      roundNumber: roundNumber,
    });

    // if (!submission) {
    //   return res.status(400).json({
    //     message: "No submission found for this round",
    //   });
    // }

    /*
    ==========================================
    PREVENT DUPLICATE SCORE
    ==========================================
    */
    const existingScore = await Score.findOne({
      judge: judge._id,
      team: team._id,
      round: round._id,
    });

    if (existingScore) {
      return res.status(400).json({
        message: "Score already submitted for this round",
      });
    }

    // JUDGE ASSIGNMENT CHECK
    const assignment = await JudgeAssignment.findOne({
      judge: judge._id,
      team: team._id,
      roundNumber: round.roundNumber,
    });

    if (!assignment) {
      return res.status(403).json({
        message: "You are not assigned to score this team for this round",
      });
    }

    /*
    ==========================================
    SAVE SCORE
    ==========================================
    */
    const newScore = await Score.create({
      judge: judge._id,
      team: team._id,
      round: round._id,
      scores: {
        uxLogic: Number(uxLogic),
        uiAesthetics: Number(uiAesthetics),
        innovation: Number(innovation),
        feasibilityAccessibility: Number(feasibilityAccessibility),
        presentation: Number(presentation),
        totalScore,
      },
      feedback,
    });

    /*
    ==========================================
    NOTIFICATION
    ==========================================
    */
    const roundLabel = `Round ${round.roundNumber}`;

    await createNotification(
      "Score Submitted",
      `${judge.name} scored ${team.teamName} in ${roundLabel} (${totalScore}/${limits.total})`,
      "score",
    );

    res.status(201).json({
      message: "Score submitted successfully",
      totalScore,
      maxAllowed: limits.total,
      newScore,
    });
  } catch (error) {
    console.log("Score Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
==================================================
GET ALL SCORES
==================================================
*/
exports.getScores = async (req, res) => {
  try {
    const scores = await Score.find()
      .populate("team", "teamName collegeName")
      .populate("judge", "name email")
      .populate("round", "roundName")
      .sort({ createdAt: -1 });

    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/*
==================================================
FINAL WINNER
==================================================
*/
exports.announceFinalWinner = async (req, res) => {
  try {
    const leaderboard = await Score.aggregate([
      {
        $group: {
          _id: "$team",
          totalScore: { $sum: "$scores.totalScore" },
        },
      },
      { $sort: { totalScore: -1 } },
      { $limit: 1 },
    ]);

    if (!leaderboard.length) {
      return res.status(404).json({
        message: "No scores found",
      });
    }

    const winner = await Team.findById(leaderboard[0]._id);

    await createNotification(
      "Final Winner Announced",
      `${winner.teamName} is the winner with ${leaderboard[0].totalScore} points.`,
      "leaderboard",
    );

    if (winner.email) {
      await sendEmail(
        winner.email,
        "🎉 Congratulations! You are the Winner",
        `
        <h1>Congratulations 🎉</h1>
        <p>Your team <strong>${winner.teamName}</strong> has won!</p>
        <p>Final Score: <strong>${leaderboard[0].totalScore}</strong></p>
        `,
      );
    }

    res.status(200).json({
      message: "Winner announced successfully",
      winner: winner.teamName,
      totalScore: leaderboard[0].totalScore,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
