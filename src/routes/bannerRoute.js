import express from "express";
import { upload } from "../middlewares/multer.js";
import {
  saveBanner,
  getBanners,
  getBannerByType,
  deleteBanner,
} from "../controllers/bannerController.js";

const router = express.Router();

router.post("/save", upload.single("image"), saveBanner);
router.get("/", getBanners);
router.get("/:type", getBannerByType);
router.delete("/:type/:bannerId", deleteBanner);

export default router;
