const Round = require("../models/round");
const createNotification = require("../utils/createNotification");


// Add Round
exports.addRound = async (req, res) => {
  try {
    const {
      roundNumber,
      title,
      deadline,
      status
    } = req.body;

    const existingRound = await Round.findOne({ roundNumber });

    if (existingRound) {
      return res.status(400).json({
        message: "Round already exists"
      });
    }

    const round = await Round.create({
      roundNumber,
      title,
      deadline,
      status
    });

    res.status(201).json({
      message: "Round created successfully",
      round
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Get All Rounds
exports.getRounds = async (req, res) => {
  try {
    const rounds = await Round.find().sort({
      roundNumber: 1
    });
    
    const currentTime = new Date();

    // First update closed rounds
    for (let round of rounds) {
      const deadline = new Date(round.deadline);

      if (
        currentTime > deadline &&
        round.status !== "Closed"
      ) {
        round.status = "Closed";
        await round.save();
      }
    }

    // Fetch updated rounds AFTER all updates
    const updatedRounds = await Round.find().sort({
      roundNumber: 1
    });

    // ONLY ONE response here
    return res.status(200).json(updatedRounds);

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};


// Delete Round
exports.deleteRound = async (req, res) => {
  try {
    await Round.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Round deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};