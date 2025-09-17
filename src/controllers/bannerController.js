import Banner from "../models/bannerModel.js";
import uploadOnCloudinary from "../utils/media/uploadImage.js";


export const saveBanner = async (req, res) => {
  try {
    const { type, url } = req.body;
    const filePath = req.file?.path;

    if (!type || !filePath) {
      return res.status(400).json({ success: false, message: "Type and image file are required" });
    }

    const uploadResult = await uploadOnCloudinary(filePath);
    if (!uploadResult?.secure_url) {
      return res.status(500).json({ success: false, message: "Failed to upload image" });
    }

    const image = uploadResult.secure_url;

    const banner = await Banner.findOneAndUpdate(
      { type },
      { $push: { banners: { image, url: url || "" } } },
      { new: true, upsert: true }
    );

    res.json({ success: true, banner });
  } catch (err) {
    console.error("Error saving banner:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json({ success: true, banners });
  } catch (err) {
    console.error("Error fetching banners:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getBannerByType = async (req, res) => {
  try {
    const { type } = req.params;
    const banner = await Banner.findOne({ type });
    if (!banner) return res.status(404).json({ success: false, message: "Banner not found" });
    res.json({ success: true, banner });
  } catch (err) {
    console.error("Error fetching banner:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteBanner = async (req, res) => {
    try {
      const { type, bannerId } = req.params;
  
      const banner = await Banner.findOneAndUpdate(
        { type },
        { $pull: { banners: { _id: bannerId } } },
        { new: true }
      );
  
      if (!banner) {
        return res.status(404).json({ success: false, message: "Banner not found" });
      }
  
      res.json({ success: true, message: "Banner deleted successfully", banner });
    } catch (err) {
      console.error("Error deleting banner:", err);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
