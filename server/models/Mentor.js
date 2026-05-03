const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    expertise: {
      type: String,
      required: true
    },

    password: {
      type: String,
      required: true
    },

    assignedTeams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Mentor ||
mongoose.model("Mentor", mentorSchema);