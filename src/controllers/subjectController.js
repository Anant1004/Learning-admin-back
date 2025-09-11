import Subject from "../models/SubjectModel.js";
import Course from "../models/CourseModel.js";
import Chapter from "../models/ChapterModel.js";

const createSubject = async (req, res) => {
  try {
    const { courseId, name, description } = req.body;

    if (!courseId || !name) {
      return res.status(400).json({ message: "CourseId and subject_name are required" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const subject = new Subject({
      courseId,
      subject_name: name,
      subject_description:description || ''
    });
    await subject.save();
    course.subjectId.push(subject._id);
    await course.save();

    res.status(201).json({ message: "Subject created successfully", subject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate("courseId chapterId");
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id).populate("courseId chapterId");
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSubject = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.courseId) {
      const course = await Course.findById(updates.courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });
    }

    const subject = await Subject.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!subject) return res.status(404).json({ message: "Subject not found" });

    res.status(200).json({ message: "Subject updated successfully", subject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByIdAndDelete(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.status(200).json({ message: "Subject deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject
};