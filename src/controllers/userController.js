import User from "../models/UserModel.js";
import bcrypt from "bcrypt";

const createUser = async (req, res) => {
  try {
    const { name, email, phoneNo, password, role, bio, expertise } = req.body;

    if (!name || !email || !phoneNo || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phoneNo,
      password: hashedPassword,
      role: role || "student",
      bio,
      expertise,
      profile_image: req.file ? req.file.path : undefined,
    });

    await user.save();

    return res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNo: user.phoneNo,
        role: user.role,
        bio: user.bio,
        expertise: user.expertise,
        profile_image: user.profile_image,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong on server", error: error.message });
  }
};


const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -__v");
    const  totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalInstructors = await User.countDocuments({ role: "instructor" });

    res.json({"users":users,stats: {
        totalUsers,
        totalAdmins,
        totalStudents,
        totalInstructors,
      }});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -__v");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, email, password, role, profile_image } = req.body;
    let updateData = { name, email, role, profile_image };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .select("-password -__v");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { createUser, getUsers, getUserById, updateUser, deleteUser };