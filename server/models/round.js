const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema(
  {
    roundNumber: {
      type: Number,
      required: true,
      unique: true
    },

    title: {
      type: String,
      required: true
    },

    deadline: {
      type: Date,
      required: true
    },

    status: {
  type: String,
  enum: ["Active", "Inactive", "Closed"],
  default: "Inactive"
}
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.models.Round || 
mongoose.model("Round", roundSchema);