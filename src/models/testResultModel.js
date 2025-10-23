import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema({
  testSeriesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TestSeries",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  answers: {
    type: Map,
    of: String,
    required: true
  },
  questionStatus: {
    type: Map,
    of: String, // questionId -> 'answered' | 'skipped' | 'review'
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  attemptedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("TestResult", testResultSchema);
