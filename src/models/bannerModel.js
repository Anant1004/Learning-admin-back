import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["website", "app1", "app2"],
      required: true,
      unique: true,
    },
    banners: [
      {
        image: { type: String, required: true },
        url: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Banner", bannerSchema);
