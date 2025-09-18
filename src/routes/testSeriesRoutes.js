import express from "express"
import { createTestSeries, getTestSeries, getTestSeriesById, deleteTestSeries, uploadPDFfile } from "../controllers/testSeriesController.js"
import { upload } from "../middlewares/multer.js"

const router = express.Router()

router.post("/", createTestSeries)
router.get("/", getTestSeries)
router.get("/:id", getTestSeriesById)
router.delete("/:id", deleteTestSeries)
router.post("/uploadPDFfile", upload.single("file"), uploadPDFfile);


export default router
