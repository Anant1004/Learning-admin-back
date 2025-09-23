import { razorpay } from "../config/razorpayConfig.js";
import crypto from "crypto";
import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Course from "../models/CourseModel.js";
import TestSeries from "../models/testSeriesModel.js";

export const createCourseOrder = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const amount = course.discountPrice || course.actualPrice;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `rcpt_course_${Date.now()}`,
      notes: {
        productType: "course",
        productId: courseId,
        userId,
      },
    };

    const order = await razorpay.orders.create(options);
    return res.json({ success: true, order, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error("createCourseOrder error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const createTestSeriesOrder = async (req, res) => {
  try {
    const { userId, testSeriesId } = req.body;

    const testSeries = await TestSeries.findById(testSeriesId);
    if (!testSeries) return res.status(404).json({ message: "Test Series not found" });

    const amount = testSeries.discountPrice || testSeries.actualPrice;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `rcpt_testseries_${Date.now()}`,
      notes: {
        productType: "testSeries",
        productId: testSeriesId,
        userId,
      },
    };

    const order = await razorpay.orders.create(options);
    return res.json({ success: true, order, key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error("createTestSeriesOrder error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, productType, productId, userId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !productType || !productId || !userId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const update =
      productType === "course"
        ? { $addToSet: { purchasedCourses: mongoose.Types.ObjectId(productId) } }
        : { $addToSet: { purchasedTestSeries: mongoose.Types.ObjectId(productId) } };

    const user = await User.findByIdAndUpdate(userId, update, { new: true })
      .populate("purchasedCourses")
      .populate("purchasedTestSeries");

    return res.json({ success: true, message: "Payment verified successfully", user });
  } catch (err) {
    console.error("verifyPayment error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
