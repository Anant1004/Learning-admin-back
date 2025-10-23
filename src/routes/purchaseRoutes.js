import express from "express";
const router = express.Router();
import { createCourseOrder,createTestSeriesOrder, verifyPayment } from "../controllers/purchaseController.js";

router.post("/create/course-order", createCourseOrder);
router.post("/create/test-series-order", createTestSeriesOrder);
router.post("/verify-payment", verifyPayment);

export default router;
