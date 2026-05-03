const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true
    },

    roundNumber: {
      type: Number,
      required: true
    },

    figmaLink: {
      type: String,
      default: ""
    },

    canvaLink: {
      type: String,
      default: ""
    },

    notes: {
      type: String,
      default: ""
    },

    pdfFile: {
      type: String,
      default: ""
    },

    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Submission ||
mongoose.model("Submission", submissionSchema);