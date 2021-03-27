const mongoose = require("mongoose");

const LearningPathSchema = new mongoose.Schema({
  technology: {
    type: String,
    required: [true, "Please add a technology"],
  },
  organisation: {
    type: String,
    required: true,
  },
  repository: {
    type: String,
    required: true,
  },
  readme: {
    type: String,
    required: true,
  },
  postedOn: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("LearningPath", LearningPathSchema);
