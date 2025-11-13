import Course from "../models/CourseModel.js";
import Category from "../models/CategoryModel.js";
import SubCategory from "../models/SubCategoryModel.js";
import User from "../models/UserModel.js";
import { courseSchema } from "../validators/courseValidator.js";
import { v2 as cloudinary } from 'cloudinary';
import cloudinaryConfig from "../config/cloudinaryConfig.js";
import Chapter from "../models/ChapterModel.js";
import Lesson from "../models/LessonModel.js";
import extractPublicId from "../helper/extractPublicId.js";
cloudinary.config(cloudinaryConfig);

const createCourse = async (req, res) => {
  console.log("Creating course...");
  try {
    const parsed = courseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error?.message,
        errors: parsed.error?.errors,
      });
    }

    const data = parsed.data;
    
    if (data.thumbnail_url) {
      try {
        const result = await cloudinary.uploader.upload(data.thumbnail_url, {
          folder: 'course_thumbnails',
          resource_type: 'auto'
        });        
        data.thumbnail_url = result.secure_url;
      } catch (uploadError) {
        console.error('Error uploading thumbnail to Cloudinary:', uploadError);
        return res.status(500).json({ 
          message: 'Failed to upload thumbnail',
          error: uploadError.message 
        });
      }
    }

    const category = await Category.findById(data.categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const subCategory = await SubCategory.findById(data.subCategoryId);
    if (!subCategory) return res.status(404).json({ message: "SubCategory not found" });

    const instructors = await User.find({
      _id: { $in: data.instructorId },
      role: "instructor",
    });
    if (instructors.length !== data.instructorId.length) {
      return res.status(404).json({ message: "One or more instructors not found" });
    }

    if (!data.paid) {
      data.actualPrice = 0;
      data.discountPrice = 0;
    }

    const course = new Course(data);
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
    const courseId = req.params.id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const chapters = await Chapter.find({ courseId: course._id });

    for (const chapter of chapters) {
      const lessons = await Lesson.find({ _id: { $in: chapter.lessons || [] } });

      for (const lesson of lessons) {
        for (const mat of lesson.materials) {
          if (mat.material_url) {
            const publicId = extractPublicId(mat.material_url);
            if (publicId) {
              await cloudinary.uploader.destroy(publicId);
            }
          }
        }

        await lesson.deleteOne();
      }

      await chapter.deleteOne();
    }

    if (course.thumbnail_url) {
      const publicId = extractPublicId(course.thumbnail_url);
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    await course.deleteOne();

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id || req.user.id;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.purchasedCourses.push(courseId);
    await user.save();

    res.status(200).json({ message: "Course enrolled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const userEnrolledCourses = async(req, res)=>{
  try {
    const userId = req.user._id || req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const courses = await User.findById(userId).populate("purchasedCourses");
    res.status(200).json(courses.purchasedCourses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollCourse,
  userEnrolledCourses
};