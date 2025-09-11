import LiveClass from "../models/LiveClassModel.js";
import Course from "../models/CourseModel.js";
import Subject from "../models/SubjectModel.js";
const createLiveClass = async (req, res) => {
    try {
        const {
            courseId,
            subjectId,
            title,
            description,
            thumbnail_url,
            meetlink,
            schedule_date,
            start_time,
            end_time
        } = req.body;
        if (!courseId || !subjectId || !title || !description || !thumbnail_url || !meetlink || !schedule_date || !start_time) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        const subject = await Subject.findOne({ _id: subjectId, courseId: courseId });
        if (!subject) {
            return res.status(404).json({ message: "Subject not found for the given course" });
        }

        const liveClass = new LiveClass({
            title,
            description,
            courseId,
            subjectId,
            thumbnail_url,
            meetlink,
            schedule_date,
            start_time,
            end_time
        });
        await liveClass.save();
        res.status(201).json({ message: "Live class created successfully", liveClass });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLiveClasses = async (req, res) => {
    try {
        const liveClasses = await LiveClass.find()
            .populate("courseId", "name")
            .populate("subjectId", "name");
        res.status(200).json(liveClasses);
    } catch (error) {
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