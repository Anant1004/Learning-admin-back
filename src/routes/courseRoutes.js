import express from "express";
import {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollCourse,
  userEnrolledCourses
} from "../controllers/courseController.js";

const router = express.Router();

router.get("/enrolled", userEnrolledCourses);
router.post("/", createCourse);
router.get("/", getCourses);
router.get("/:id", getCourseById);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);
router.post("/:id/enroll", enrollCourse);

export default router;
