import Lesson from "../models/LessonModel.js";
import Course from "../models/CourseModel.js";
import Chapter from "../models/ChapterModel.js"

// const createLesson = async (req, res) => {
//     try {
//         const { title, description, duration, chapterId, courseId } = req.body;

//         if (!title && !description && !duration) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Title, description and duration are required",
//             });
//         }
//         if (!chapterId && !courseId) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Chapter Id, CourseId are required",
//             });
//         }
//         const course = await Course.findById(courseId)
//         if (!course) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Course is not found",
//             });
//         }
//         const chapter = await Chapter.findById(chapterId)
//         if (!chapter) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Chapter is not found",
//             });
//         }
//         const lesson = await Lesson.create({
//             title,
//             description,
//             duration,
//         });

//         chapter.lessons.push(lesson._id);
//         await chapter.save();
//         console.log("XXXXXXXXXXXXX:",chapter)
//         res.status(201).json({
//             success: true,
//             data: lesson,
//             message: "Lesson created successfully",
//         });
//     } catch (err) {
//         res.status(400).json({
//             success: false,
//             message: err.message,
//         });
//     }
// };

const createLesson = async (req, res) => {
   
    try {
        const { title, description, duration, video_url, video_thumnail, materials, chapterId, courseId } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: "Lesson title is required" });
        }
        if (!duration) {
            return res.status(400).json({ success: false, message: "Duration is required" });
        }
         if (!description) {
            return res.status(400).json({ success: false, message: "Lesson description is required" });
        }
        if (!video_url) {
            return res.status(400).json({ success: false, message: "Video Url is required" });
        }
         if (!video_thumnail) {
            return res.status(400).json({ success: false, message: "Video thumnail is required" });
        }

        if (!chapterId && !courseId) {
            return res.status(400).json({
                success: false,
                message: "Chapter Id, CourseId are required",
            });
        }
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(400).json({
                success: false,
                message: "Course is not found",
            });
        }
        const chapter = await Chapter.findById(chapterId)
        if (!chapter) {
            return res.status(400).json({
                success: false,
                message: "Chapter is not found",
            });
        }

        let validatedMaterials = [];
        if (materials && Array.isArray(materials)) {
            for (let mat of materials) {
                if (
                    !mat.material_type ||
                    !["notes", "pdf", "assignment"].includes(mat.material_type)
                ) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid material_type, must be 'notes', 'pdf' or 'assignment'",
                    });
                }
                validatedMaterials.push({
                    material_type: mat.material_type,
                    material_title: mat.material_title || null,
                    material_url: mat.url || null,
                });
            }
        }

        const lessonData = {
            title,
            description: description || null,
            duration,
            video_url: video_url || null,
            video_thumnail: video_thumnail || null,
            materials: validatedMaterials,
        };

        const lesson = await Lesson.create(lessonData);
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
        const lesson = await Lesson.findById(req.params.id).populate("lessons");
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
        const lesson = await Lesson.findByIdAndDelete(req.params.id);
        if (!lesson) {
            return res.status(404).json({ success: false, message: "Lesson not found" });
        }
        res.json({ success: true, message: "Lesson deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export { createLesson, getLessons, getLessonById, updateLesson, deleteLesson }
