import TestResult from "../models/testResultModel.js";


const createTestResult = async (req, res) => {
  try {
    const { testSeriesId, userId, answers, questionStatus, score, totalMarks } = req.body;

    const newResult = await TestResult.create({
      testSeriesId,
      userId,
      answers,
      questionStatus,
      score,
      totalMarks
    });

    res.status(201).json({ success: true, result: newResult });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to save result" });
  }
};

const getAllTestResults = async (req, res) => {
  try {
    const results = await TestResult.find().populate("testSeriesId").populate("userId");
    res.status(200).json({ success: true, results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch results" });
  }
};

const getTestResultById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await TestResult.findById(id).populate("testSeriesId").populate("userId");
    if (!result) {
      return res.status(404).json({ success: false, message: "Result not found" });
    }
    res.status(200).json({ success: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch result" });
  }
};

const getTestResultByTestId = async (req, res) => {
  try {
    const { testSeriesId } = req.params;
    const results = await TestResult.find({ testSeriesId }).populate("testSeriesId").populate("userId");
    if (!results) {
      return res.status(404).json({ success: false, message: "Results not found" });
    }
    res.status(200).json({ success: true, results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch results" });
  }
};

const getTestResultByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const results = await TestResult.find({ userId }).populate("testSeriesId").populate("userId");
    if (!results) {
      return res.status(404).json({ success: false, message: "Results not found" });
    }
    res.status(200).json({ success: true, results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch results" });
  }
};

export { createTestResult, getAllTestResults, getTestResultById, getTestResultByTestId, getTestResultByUserId };
