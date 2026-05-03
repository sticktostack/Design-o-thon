const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true
    },

    collegeName: {
      type: String,
      required: true
    },

    teamLeader: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    currentRound: {
      type: Number,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Team ||mongoose.model("Team", teamSchema);