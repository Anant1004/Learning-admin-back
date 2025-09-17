import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Lesson title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      min: [1, "Duration must be at least 1 minute"],
    },
    video_url: {
      type: String,
      trim: true
    },
    video_thumnail: {
      type: String,
      trim: true
    },
    materials: [
      {
        material_type: {
          type: String,
          enum: ["notes", "pdf", "assignment"],
          trim: true,
        },
        material_title: {
          type: String,
          trim: true
        },
        material_url: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Lesson", lessonSchema);
