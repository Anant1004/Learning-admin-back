import cloudinary from "../config/cloudinaryConfig.js";

const generateSignature = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder: "lms_videos" },
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      timestamp,
      signature,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder: "lms_videos",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generating signature" });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ success: false, message: "public_id is required" });
    }

    const result = await cloudinary.uploader.destroy(public_id);

    res.status(200).json({
      success: true,
      message: "Material deleted from Cloudinary successfully",
      result,
    });
  } catch (err) {
    console.error("Cloudinary delete error:", err);
    res.status(500).json({ success: false, message: "Failed to delete material" });
  }
};


export { generateSignature, deleteMaterial }