import express from "express";
const router = express.Router();
import { createTestResult, getAllTestResults, getTestResultById, getTestResultByTestId, getTestResultByUserId } from "../controllers/testResultController.js";

router.post("/", createTestResult);
router.get("/", getAllTestResults);
router.get("/:id", getTestResultById);
router.get("/test/:testSeriesId", getTestResultByTestId);
router.get("/user/:userId", getTestResultByUserId);

export default router;