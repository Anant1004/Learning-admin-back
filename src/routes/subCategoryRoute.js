import express from "express";
import {
  createSubCategory,
  getSubCategories,
  getSubCategoryByIdBycategory,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/subcategoryController.js";

const router = express.Router();

router.post("/", createSubCategory);
router.get("/", getSubCategories);
router.get("/:id", getSubCategoryByIdBycategory);
router.put("/:id", updateSubCategory);
router.delete("/:id", deleteSubCategory);

export default router;
