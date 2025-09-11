import express from "express";
import {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";

const router = express.Router();

router.post("/", createSubject);    
router.get("/", getSubjects);      
router.get("/:id", getSubjectById); 
router.put("/:id", updateSubject); 
router.delete("/:id", deleteSubject); 

export default router;
