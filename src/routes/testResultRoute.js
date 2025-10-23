import express from "express";
const router = express.Router();
import { createTestResult, getAllTestResults, getTestResultById, getTestResultByTestId } from "../controllers/testResultController.js";

router.post("/", createTestResult);
router.get("/", getAllTestResults);
router.get("/:id", getTestResultById);
router.get("/test/:testSeriesId", getTestResultByTestId);

export default router;