import TestSeries from "../models/testSeriesModel.js"
import uploadOnCloudinary from "../utils/media/uploadImage.js"

export const createTestSeries = async (req, res) => {
  try {
    let {
      title,
      description,
      terms,
      duration,
      paid,
      price,
      startDate,
      endDate,
      totalMarks,
      questions,
      marksPerQuestion,
    } = req.body;

    if (typeof terms === "string") terms = JSON.parse(terms);
    if (typeof questions === "string") questions = JSON.parse(questions);
    if (typeof paid === "string") paid = paid === "true";
    if (Array.isArray(totalMarks)) totalMarks = totalMarks[0];

    duration = Number(duration);
    price = Number(price);
    totalMarks = Number(totalMarks);

    if (paid && (!price || price <= 0)) {
      return res.status(400).json({ message: "Price is required for paid test series" });
    }

    if (!Array.isArray(terms) || terms.length === 0) {
      return res.status(400).json({ message: "Terms must be a non-empty array" });
    }
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "At least one question is required" });
    }

    marksPerQuestion = marksPerQuestion || 1;

    const formattedQuestions = questions.map((q) => ({
      question: q.question,
      options: q.options.map((opt) => ({ name: opt })),
      correctAns: q.correctAns,
    }));

    const newTestSeries = new TestSeries({
      title,
      description,
      terms,
      duration,
      paid,
      price,
      startDate,
      endDate,
      totalMarks,
      marksPerQuestion,
      questions: formattedQuestions,
    });

    const savedTestSeries = await newTestSeries.save();

    res.status(201).json({
      message: "Test series created successfully",
      testSeries: savedTestSeries,
    });
  } catch (error) {
    console.error("Error creating test series:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const uploadPDFfile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const pdfPath = req.file.path;
    const result = await uploadOnCloudinary(pdfPath);

    if (!result) {
      return res.status(500).json({ message: "Failed to upload file" });
    }

    res.status(200).json({
      message: "File uploaded successfully",
      pdfUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getTestSeries = async (req, res) => {
  try {
    const testSeries = await TestSeries.find();
    res.status(200).json(testSeries);
  } catch (error) {
    console.error("Error fetching test series:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getTestSeriesById = async (req, res) => {
  try {
    const testSeries = await TestSeries.findById(req.params.id);
    res.status(200).json(testSeries);
  } catch (error) {
    console.error("Error fetching test series by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
