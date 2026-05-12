const Admin = require("../models/Admin");
const Team = require("../models/team");
const Judge = require("../models/judge");
const Submission = require("../models/submission");
const Round = require("../models/round");
const Notification = require("../models/Notification");
const Score = require("../models/Score");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createNotification = require("../utils/createNotification");


/*
==================================================
REGISTER ADMIN
==================================================
*/
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({
      email
    });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Admin registered successfully",
      admin
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/*
==================================================
LOGIN ADMIN
==================================================
*/
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({
      email
    });

    if (!admin) {
      return res.status(404).json({
        message: "Admin not found"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: admin._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      admin
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


/*
==================================================
ADVANCED ADMIN ANALYTICS DASHBOARD
==================================================
*/
exports.getAnalytics = async (req, res) => {
  try {
    /*
    ==========================================
    BASIC COUNTS
    ==========================================
    */
    const totalTeams =
      await Team.countDocuments();

    const totalJudges =
      await Judge.countDocuments();

    const totalSubmissions =
      await Submission.countDocuments();

    const activeRounds =
      await Round.countDocuments({
        status: "Active"
      });

    /*
    ==========================================
    RECENT ACTIVITIES
    ==========================================
    */
    const recentActivities =
      await Notification.find()
        .sort({ createdAt: -1 })
        .limit(8);

    /*
    ==========================================
    TOP PERFORMING TEAMS
    ==========================================
    */
    const topTeams = await Score.aggregate([
      {
        $group: {
          _id: "$team",
          totalScore: {
            $sum: "$scores.totalScore"
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

    const populatedTopTeams =
      await Team.populate(
        topTeams,
        {
          path: "_id",
          select: "teamName collegeName"
        }
      );

    /*
    ==========================================
    RESPONSE
    ==========================================
    */
    res.status(200).json({
      totalTeams,
      totalJudges,
      totalSubmissions,
      activeRounds,
      recentActivities,
      topTeams: populatedTopTeams
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};