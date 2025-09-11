import mongoose from "mongoose";

const freeVideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    tags:{
     type:String 
    },
    type: {
      type: String,
      enum: ["youtube", "youtube shorts", "other"],
      required: true,
    },
    video_url: {
      type: String,
      required: true,
    },
    thumbnail_url: {
      type: String,
      required: true,
    },
    status:{
      type:String
    }
    
    
  },
  { timestamps: true }
);

export default mongoose.model("FreeVideo", freeVideoSchema);
