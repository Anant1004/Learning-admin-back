import FreeVideo from "../models/FreeVideoModel.js";


const createFreeVideo = async (req, res) => {
  try {
    const {
      title,
      description,
      categoryId,
      tags,
      type,
      video_url,
      thumbnail_url,
      status,
    } = req.body;

    console.log("XXXXXXXXXXXXXX:",req.body)
    // 🔹 Required fields validation
    if (!title || !description || !categoryId || !video_url || !thumbnail_url || !type) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // 🔹 Validate type
    const validTypes = ["youtube", "youtube shorts", "other"];
    if (!validTypes.includes(type.toLowerCase())) {
      return res
        .status(400)
        .json({ message: "Type must be one of: youtube, youtube shorts, other" });
    }

    // 🔹 Create new video
    const freeVideo = new FreeVideo({
      title: title.trim(),
      description: description.trim(),
      categoryId: categoryId,
      tags: tags || "",
      type: type.toLowerCase(),
      video_url: video_url.trim(),
      thumbnail_url: thumbnail_url.trim(),
      status: status || "active", // default active
    });

    await freeVideo.save();

    res.status(201).json({
      message: "Free video created successfully",
      freeVideo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getFreeVideos = async (req, res) => {
  try {
    // total videos ka count
    const totalVideos = await FreeVideo.countDocuments();

    // published videos ka count
    const publishedVideos = await FreeVideo.countDocuments({ status: "published" });

    // draft videos ka count
    const draftVideos = await FreeVideo.countDocuments({ status: "draft" });

    // agar aapko saare videos ka data bhi chahiye
    const freeVideos = await FreeVideo.find().select("-__v");

    res.status(200).json({
      freevideos: freeVideos,
      totalvideo: totalVideos,
      publishedvideos: publishedVideos,
      draftvideos: draftVideos
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getFreeVideoById = async (req, res) => {
    try {
        const freeVideo = await FreeVideo.findById(req.params.id).select("-__v");
        if (!freeVideo) {
            return res.status(404).json({ message: "Free video not found" });
        }
        res.status(200).json(freeVideo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateFreeVideo = async (req, res) => {
    try {
        const freeVideo = await FreeVideo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        if (!freeVideo) {
            return res.status(404).json({ message: "Free video not found" });
        }
        res.status(200).json({ message: "Free video updated successfully", freeVideo });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteFreeVideo = async (req, res) => {
    try {
        const freeVideo = await FreeVideo.findByIdAndDelete(req.params.id);
        if (!freeVideo) {
            return res.status(404).json({ message: "Free video not found" });
        }
        res.status(200).json({ message: "Free video deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export {
    createFreeVideo,
    getFreeVideos,
    getFreeVideoById,
    updateFreeVideo,
    deleteFreeVideo,
};
