import LiveClass from "../models/LiveClassModel.js";
import Course from "../models/CourseModel.js";
import Chapter from "../models/ChapterModel.js";
import Lesson from "../models/LessonModel.js";
import Subject from "../models/SubjectModel.js";
const createLiveClass = async (req, res) => {
  try {
    const {
      title,
      description,
      courseId,
      chapterId,
      lessonId,
      startDate,
      endDate,
      meet_link,
      thumbnail_url
    } = req.body;

    if (!title || !description || !courseId || !chapterId || !lessonId || !startDate || !endDate || !meet_link || !thumbnail_url) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const chapter = await Chapter.findOne({ _id: chapterId });
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found for the given course" });
    }

    const lesson = await Lesson.findOne({ _id: lessonId });
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found for the given chapter" });
    }

    const liveClass = new LiveClass({
      title,
      description,
      courseId,
      chapterId,
      lessonId,
      startDate,
      endDate,
      meet_link,
      thumbnail_url
    });

    await liveClass.save();

    res.status(201).json({ message: "Live class created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLiveClasses = async (req, res) => {
  try {
    const liveClasses = await LiveClass.find()
      .populate("courseId", "title")    
      .populate("chapterId", "chapter_name")  
      .populate("lessonId", "title")   
      .lean();

    res.status(200).json({ liveclass: liveClasses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};



const getLiveClassById = async (req, res) => {
    try {
        const liveClass = await LiveClass.findById(req.params.id)
            .populate("courseId", "name")
            .populate("subjectId", "name");

        if (!liveClass) {
            return res.status(404).json({ message: "Live class not found" });
        }
        res.status(200).json(liveClass);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateLiveClass = async (req, res) => {
    try {
        const liveClass = await LiveClass.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (!liveClass) {
            return res.status(404).json({ message: "Live class not found" });
        }

        res.status(200).json({ message: "Live class updated successfully", liveClass });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteLiveClass = async (req, res) => {
    try {
        const liveClass = await LiveClass.findByIdAndDelete(req.params.id);
        if (!liveClass) {
            return res.status(404).json({ message: "Live class not found" });
        }
        res.status(200).json({ message: "Live class deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createLiveClass, getLiveClasses, getLiveClassById, updateLiveClass, deleteLiveClass };