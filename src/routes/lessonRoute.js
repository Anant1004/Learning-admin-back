import express from "express";
import {
createLesson, getLessons, getLessonById, updateLesson, deleteLesson

} from "../controllers/lessonController.js";
const router = express.Router();

router.post("/", createLesson);
router.get("/", getLessons);
router.get("/:id", getLessonById);
router.put("/:id", updateLesson);
router.delete("/:id", deleteLesson);

export default router;
