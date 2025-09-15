import express from "express"
import { createTestSeries, uploadPDFfile } from "../controllers/testSeriesController.js"
import { upload } from "../middlewares/multer.js"

const router = express.Router()

router.post("/", createTestSeries)
router.post("/uploadPDFfile", upload.single("file"), uploadPDFfile);


export default router
