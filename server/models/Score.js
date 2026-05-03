const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema(
  {
    judge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Judge",
      required: true,
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true,
    },

    round: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Round",
      required: true,
    },

    // Criteria-based scoring
    scores: {
      uxLogic: {
        type: Number,
        required: true,
        min: 0,
        max: 30,
        default: 0,
      },

      uiAesthetics: {
        type: Number,
        required: true,
        min: 0,
        max: 30,
        default: 0,
      },

      innovation: {
        type: Number,
        required: true,
        min: 0,
        max: 20,
        default: 0,
      },

      feasibilityAccessibility: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
        default: 0,
      },

      presentation: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
        default: 0,
      },

      totalScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        default: 0,
      },
    },

    feedback: {
      type: String,
      default: "",
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Score ||
mongoose.model("Score", scoreSchema);