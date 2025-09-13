import Category from "../models/CategoryModel.js";
import SubCategory from "../models/SubCategoryModel.js";

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ error: "Name and description is required" });
    }
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json({ message: "Category created successfully", category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}, { name: 1,description:1 });
    res.json({data:categories});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById({ "_id": id }, { name: 1,description:1 });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const category = await Category.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    const result = await SubCategory.deleteMany({ categoryId: id });
    if (result.deletedCount > 0) {
      return res.json({
        message: "Category and its subcategories deleted successfully",
      });
    } else {
      return res.json({
        message: "Category deleted successfully (no subcategories found)",
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCategoryAndSubcategory = async (req, res) => {
  try {
    const subcategories = await SubCategory.find().populate("categoryId");

    // Grouping by categoryId
    const categoryMap = {};

    subcategories.forEach((sub) => {
      const cat = sub?.categoryId;

      // Agar categoryId hi nahi hai to skip karo
      if (!cat?._id) return;

      if (!categoryMap[cat._id]) {
        categoryMap[cat._id] = {
          _id: cat._id,
          name: cat.name,
          description: cat.description,
          subcategories: []
        };
      }

      categoryMap[cat._id].subcategories.push({
        _id: sub._id,
        name: sub.name,
        description: sub.description
      });
    });

    const result = Object.values(categoryMap); // Convert map to array
    res.json({ categories: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




export { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory, getCategoryAndSubcategory }
