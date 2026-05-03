const mongoose = require("mongoose");

const judgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    expertise: {
      type: String,
    },

    password: {
      type: String,
      required: true,
    },

    assignedTeams: [
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true
    },

    roundNumber: {
      type: Number,
      required: true
    }
  }
]
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.models.Judge || mongoose.model("Judge", judgeSchema);
