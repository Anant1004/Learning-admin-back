import Lesson from "../models/LessonModel.js";
import Course from "../models/CourseModel.js";
import Chapter from "../models/ChapterModel.js";
import extractPublicId from "../helper/extractPublicId.js";
import cloudinary from "../config/cloudinaryConfig.js";

const createLesson = async (req, res) => {
  try {
    const { title, description, duration, videos, materials, chapterId, courseId } = req.body;

    if (!title || !description || !duration) {
      return res.status(400).json({ success: false, message: "Title, description and duration are required" });
    }

    if (!videos || !Array.isArray(videos) || videos.length === 0) {
      return res.status(400).json({ success: false, message: "At least one video is required" });
    }

    if (!chapterId || !courseId) {
      return res.status(400).json({ success: false, message: "ChapterId and CourseId are required" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    const chapter = await Chapter.findById(chapterId);
    if (!chapter) return res.status(404).json({ success: false, message: "Chapter not found" });

    const validatedVideos = videos.map((v) => ({
      video_url: v.video_url,
      video_thumbnail: v.video_thumbnail,
    }));

    const validatedMaterials = Array.isArray(materials)
      ? materials.map((mat) => ({
          material_type: mat.material_type,
          material_title: mat.material_title || null,
          material_url: mat.url || null,
        }))
      : [];

    const lesson = await Lesson.create({
      title,
      description,
      duration,
      videos: validatedVideos,
      materials: validatedMaterials,
    });

    chapter.lessons.push(lesson._id);
    await chapter.save();

    res.status(201).json({ success: true, data: lesson });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ createdAt: -1 });
    res.json({ success: true, data: lessons });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }
    res.json({ success: true, data: lesson });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lesson) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }
    res.json({ success: true, data: lesson });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ success: false, message: "Lesson not found" });
    }

    for (const mat of lesson.materials) {
      let publicId = mat.material_public_id;
      if (!publicId && mat.material_url) {
        publicId = extractPublicId(mat.material_url);
      }
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error("Cloudinary delete error:", err.message);
        }
      }
    }

    await lesson.deleteOne();
    res.json({ success: true, message: "Lesson & related Cloudinary files deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export { createLesson, getLessons, getLessonById, updateLesson, deleteLesson };
