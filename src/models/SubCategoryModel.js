import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true
  },
  description:{
    type: String,
    required: true
  },
  categoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Category", 
    required: true 
  }
});

export default mongoose.model("SubCategory", subCategorySchema);
