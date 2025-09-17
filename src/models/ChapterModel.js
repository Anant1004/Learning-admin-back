import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema({
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

  lessons: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
    }
  ],

 
});

export default mongoose.model("Chapter", chapterSchema);
