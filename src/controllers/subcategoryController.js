import SubCategory from "../models/SubCategoryModel.js";

const createSubCategory = async (req, res) => {
  try {
    const { name,description, categoryId } = req.body;

    if (!name || !categoryId) {
      return res.status(400).json({ error: "Name and categoryId are required" });
    }

    const subCategory = new SubCategory({ name,description, categoryId });
    await subCategory.save();

    res.status(201).json({ message: "SubCategory created successfully", subCategory });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate("categoryId","-__v").select('-__v');
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSubCategoryByIdBycategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await SubCategory.find({"categoryId":id})

    if (!subCategory) {
      return res.status(404).json({ error: "SubCategory not found" });
    }

    res.json({data:subCategory});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const subCategory = await SubCategory.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).populate("categoryId");

    if (!subCategory) {
      return res.status(404).json({ error: "SubCategory not found" });
    }

    res.json({ message: "SubCategory updated successfully", subCategory });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE
const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await SubCategory.findByIdAndDelete(id);

    if (!subCategory) {
      return res.status(404).json({ error: "SubCategory not found" });
    }

    res.json({ message: "SubCategory deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export {createSubCategory,getSubCategories,getSubCategoryByIdBycategory,updateSubCategory,deleteSubCategory}