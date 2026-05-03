const Submission = require("../models/Submission");
const Round = require("../models/Round");
const Team = require("../models/Team");
const createNotification = require("../utils/createNotification");

// Team Submission
exports.createSubmission = async (req, res) => {
  try {
    const { teamName, roundNumber, figmaLink, canvaLink, notes } = req.body;

    // Find Team by Name
    const team = await Team.findOne({ teamName });

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    // Check Round Exists
    const round = await Round.findOne({ roundNumber });

    if (!round) {
      return res.status(404).json({
        message: "Round not found",
      });
    }

    // Auto Submission Lock
    const currentTime = new Date();
    const deadline = new Date(round.deadline);

    if (currentTime > deadline) {
      return res.status(400).json({
        message: "Submission deadline is over",
      });
    }

    // Prevent Duplicate Submission
    const existingSubmission = await Submission.findOne({
      team: team._id,
      roundNumber,
    });

    if (existingSubmission) {
      return res.status(400).json({
        message: "Submission already exists for this round",
      });
    }

    const submission = await Submission.create({
      team: team._id,
      roundNumber,
      figmaLink,
      canvaLink,
      notes,
      pdfFile: req.file ? req.file.filename : "",
    });

    res.status(201).json({
      message: "Submission uploaded successfully",
      submission,
    });
    await createNotification(
      "New Submission Uploaded",
      `${team.teamName} submitted Round ${roundNumber}.`,
      "submission",
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Submissions
exports.getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("team", "teamName collegeName")
      .sort({ createdAt: -1 });

    res.status(200).json(submissions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
