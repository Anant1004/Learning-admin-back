import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  subCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true
  },
  course_topic: [
    {
      type: String,
      required: true,
      trim: true
    }
  ],
  course_languages: [
    {
      type: String,
      required: true,
      trim: true
    }
  ],
  subtitle_language: [{
    type: String,
    trim: true
  }],
  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  instructorId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  ],
  paid: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  actualPrice: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
    required: true,
  },
  schedule: [
    {
      type: String,
      required: true,
      trim: true
    }
  ],
  outcomes: [{
    type: String,
    required: true,
    trim: true
  }],
  faq: [
    {
      question: String,
      answer: String,
    }
  ],
  thumbnail_url: {
    type: String,
    required: true,
    trim: true
  },
  video_url: {
    type: String,
    required: true,
    trim: true
  },
  subjectId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subject",
  }],
  chapterId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chapter",
  }],
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);
