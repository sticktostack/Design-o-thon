const Team = require("../models/Team");
const Judge = require("../models/Judge");
const Submission = require("../models/Submission");
const Round = require("../models/Round");
const Score = require("../models/Score");
const createNotification = require("../utils/createNotification");


exports.getDashboardStats = async (req, res) => {
  try {
    // Total counts
    const totalTeams = await Team.countDocuments();
    const totalJudges = await Judge.countDocuments();
    const totalSubmissions = await Submission.countDocuments();

    const activeRounds = await Round.countDocuments({
      status: "Active"
    });

    // Top performing teams
    const topTeams = await Score.aggregate([
      {
        $group: {
          _id: "$team",
          totalScore: {
            $sum: "$score"
          }
        }
      },
      {
        $sort: {
          totalScore: -1
        }
      },
      {
        $limit: 5
      }
    ]);

    const populatedTopTeams = await Team.populate(
      topTeams,
      {
        path: "_id",
        select: "teamName collegeName"
      }
    );

    // Recent submissions (recent activities)
    const recentActivities = await Submission.find()
      .populate("team", "teamName")
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      totalTeams,
      totalJudges,
      totalSubmissions,
      activeRounds,
      topTeams: populatedTopTeams,
      recentActivities
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};