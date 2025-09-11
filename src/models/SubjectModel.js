import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    subject_name: {
      type: String,
      required: true,
      trim: true,
    },
    subject_description: {
      type: String,
      trim: true,
    },
    chapterId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
    }],
  },
  {
    timestamps: true,
  },
);

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;
