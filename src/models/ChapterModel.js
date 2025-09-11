import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
  SubjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
    required: true,
  },
  chapter_name: {
    type: String,
    required: true,
    trim: true,
  },
  chapter_description: {
    type: String,
    required: true,
    trim: true,
  },

  content: [
    {
      content_type: {
        type: String,
        enum: ["Video", "Notes", "Test", "DPP", "Assignment"],
        required: true,
        trim: true,
      },
      content_name: {
        type: String,
        required: true,
        trim: true,
      },
      content_url: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
});

export default mongoose.model("Chapter", chapterSchema);
