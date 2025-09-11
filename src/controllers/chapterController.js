import Chapter from "../models/ChapterModel.js";
import Subject from "../models/SubjectModel.js";
import CourseModel from "../models/CourseModel.js";

const createChapter = async (req, res) => {
  try {
    const { SubjectId, chapter_name,chapter_description, content , courseId } = req.body;

    if (!SubjectId || !chapter_name) {
      return res.status(400).json({ message: "SubjectId and chapter_name are required" });
    }

    const subject = await Subject.findById(SubjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    if (content && Array.isArray(content)) {
      for (const item of content) {
        if (!item.content_type || !item.content_name || !item.content_url) {
          return res.status(400).json({ message: "Each content must have type, name, and url" });
        }
      }
    }

    const chapter = new Chapter({
      SubjectId,
      chapter_name,
      chapter_description:chapter_description || '',
      content
    });
    await chapter.save();
    const course = await CourseModel.findById(courseId);
    if (course) {
      course.chapterId.push(chapter._id);
      await course.save();
    }

    res.status(201).json({ message: "Chapter created successfully", chapter });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChapters = async (req, res) => {
  try {
    const chapters = await Chapter.find().populate("SubjectId");
    res.status(200).json(chapters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id).populate("SubjectId");
    if (!chapter) return res.status(404).json({ message: "Chapter not found" });
    res.status(200).json(chapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    getChapterById
}
