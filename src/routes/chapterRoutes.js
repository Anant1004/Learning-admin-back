import express from "express";
import { createChapter, getChapters, getChapterById, updateChapter, deleteChapter } from "../controllers/chapterController.js";

const router = express.Router();

router.post("/", createChapter);       
router.get("/", getChapters);           
router.get("/:id", getChapterById);     
router.put("/:id", updateChapter);      
router.delete("/:id", deleteChapter);   

export default router;
