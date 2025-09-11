import Course from "../models/CourseModel.js";
import Category from "../models/CategoryModel.js";
import SubCategory from "../models/SubCategoryModel.js";
import User from "../models/UserModel.js";

const createCourse = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      categoryId,
      subCategoryId,
      course_topic,     //array
      course_languages,  //array
      subtitle_language, //array
      level,
      duration,
      instructorId,    //array
      paid,
      startDate,
      endDate,
      actualPrice,
      discountPrice,
      schedule,      //array
      outcomes,      //array
      faq,           //array
      thumbnail_url,
      video_url,
      subjectId
    } = req.body;

    if (!categoryId) {
      return res.status(400).json({ message: "Category Id is required" });
    }
    if (!subCategoryId) {
      return res.status(400).json({ message: "SubCategory Id is required" });
    }
    if (!instructorId || instructorId.length === 0) {
      return res.status(400).json({ message: "Instructor Id is required" });
    }

    if (
      !title ||
      !description ||
      !course_topic ||
      course_topic.length === 0 ||
      !course_languages ||
      course_languages.length === 0 ||
      !level ||
      !duration ||
      !startDate ||
      !endDate ||
      !thumbnail_url ||
      !video_url
    ) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    if (!schedule || !Array.isArray(schedule) || schedule.length === 0) {
      return res.status(400).json({ message: "Schedule is required and should not be empty" });
    }

    if (!outcomes || !Array.isArray(outcomes) || outcomes.length === 0) {
      return res.status(400).json({ message: "Outcomes are required and should not be empty" });
    }

    if (!faq || !Array.isArray(faq) || faq.length === 0) {
      return res.status(400).json({ message: "FAQ is required and should not be empty" });
    }
    if (!subtitle_language || !Array.isArray(subtitle_language) || subtitle_language.length === 0) {
      return res.status(400).json({ message: "Subtitle language is required and should not be empty" });
    }
    if (!course_languages || !Array.isArray(course_languages) || course_languages.length < 1) {
      return res.status(400).json({
        message: "At least one course language is required"
      });
    }
    if (!course_topic || !Array.isArray(course_topic) || course_topic.length < 1) {
      return res.status(400).json({
        message: "At least one course topic is required"
      });
    }


    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) {
      return res.status(404).json({ message: "SubCategory not found" });
    }

    const instructors = await User.find({
      _id: { $in: instructorId },
      role: "instructor",
    });
    if (instructors.length !== instructorId.length) {
      return res.status(404).json({ message: "One or more instructors not found or invalid" });
    }

    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ message: "End date must be after start date" });
    }

    if (paid) {
      if (actualPrice == null || discountPrice == null) {
        return res.status(400).json({
          message: "Actual price and discount price are required for paid courses",
        });
      }
      if (discountPrice > actualPrice) {
        return res.status(400).json({
          message: "Discount price cannot be greater than actual price",
        });
      }
    } else {
      req.body.actualPrice = 0;
      req.body.discountPrice = 0;
    }


    const course = new Course({
      title,
      subtitle,
      description,
      categoryId,
      subCategoryId,
      subjectId,
      course_topic,
      course_languages,
      subtitle_language,
      level,
      duration,
      instructorId,
      paid,
      startDate,
      endDate,
      actualPrice: req.body.actualPrice,
      discountPrice: req.body.discountPrice,
      schedule,
      outcomes,
      faq,
      thumbnail_url,
      video_url
    });
    await course.save();

    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("categoryId subCategoryId instructorId subjectId chapterId");
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("categoryId subCategoryId instructorId subjectId chapterId");
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    const updates = req.body;

    if (updates.startDate && updates.endDate) {
      if (new Date(updates.startDate) >= new Date(updates.endDate)) {
        return res.status(400).json({ message: "End date must be after start date" });
      }
    }

    if (updates.actualPrice && updates.discountPrice) {
      if (updates.discountPrice > updates.actualPrice) {
        return res.status(400).json({ message: "Discount price cannot be greater than actual price" });
      }
    }

    const course = await Course.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!course) return res.status(404).json({ message: "Course not found" });

    res.status(200).json({ message: "Course updated successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse
};