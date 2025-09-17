import Chapter from "../models/ChapterModel.js";
import Subject from "../models/SubjectModel.js";
import Course from "../models/CourseModel.js";

const createChapter = async (req, res) => {
  try {
    const { chapter_name, chapter_description, courseId } = req.body;

    // Validation
    if (!chapter_name || !chapter_description || !courseId) {
      return res
        .status(400)
        .json({ message: "chapter_name, chapter_description and courseId are required" });
    }

    // Find course once
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Create chapter
    const chapter = new Chapter({
      chapter_name,
      chapter_description,
    });
    await chapter.save();

    // Add chapter to course
    if (!Array.isArray(course.chapterId)) course.chapterId = [];
    course.chapterId.push(chapter._id);
    await course.save();

    res.status(201).json({ message: "Chapter created successfully", chapter });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getChapters = async (req, res) => {
  try {
    const chapters = await Chapter.find().populate("lessons");
    res.status(200).json(chapters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id).populate("lessons", "-__v -updatedAt -createdAt").select("-__v");
    if (!chapter) return res.status(404).json({ message: "Chapter not found" });
    res.status(200).json({ chapters: chapter });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChapterByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId)
      .populate({
        path: "chapterId",
        populate: {
          path: "lessons",
          populate: {
            path: "materials",
          },
        },
      });

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const totalMaterials = course.chapterId.reduce((chapterAcc, chapter) => {
      return (
        chapterAcc +
        chapter.lessons.reduce((lessonAcc, lesson) => {
          return lessonAcc + (lesson.materials ? lesson.materials.length : 0);
        }, 0)
      );
    }, 0);

    const totalLessons = course.chapterId.reduce(
      (lessonCount, chapter) => lessonCount + (chapter.lessons ? chapter.lessons.length : 0),
      0
    );

    return res.status(200).json({
      success: true,
      totalMaterials,
      totalLessons,     
      title: course.title,
      subtitle: course.subtitle,
      description: course.description,
      chapters: course.chapterId,
    });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};



const updateChapter = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.SubjectId) {
      const subject = await Subject.findById(updates.SubjectId);
      if (!subject) return res.status(404).json({ message: "Subject not found" });
    }

    if (updates.content && Array.isArray(updates.content)) {
      for (const item of updates.content) {
        if (!item.content_type || !item.content_name || !item.content_url) {
          return res.status(400).json({ message: "Each content must have type, name, and url" });
        }
      }
    }

    const chapter = await Chapter.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!chapter) return res.status(404).json({ message: "Chapter not found" });

    res.status(200).json({ message: "Chapter updated successfully", chapter });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteChapter = async (req, res) => {
  try {
    const chapter = await Chapter.findByIdAndDelete(req.params.id);
    if (!chapter) return res.status(404).json({ message: "Chapter not found" });
    res.status(200).json({ message: "Chapter deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createChapter,
  deleteChapter,
  updateChapter,
  getChapters,
  getChapterById,
  getChapterByCourseId,
}
