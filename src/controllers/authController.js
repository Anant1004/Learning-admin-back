import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { cookieOptions } from "../utils/cookie/cookieOptions.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ ok: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ ok: false, message: "Invalid email or password" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ ok: false, message: "You are not authorized to login as admin !" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ ok: false, message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // res
    //   .cookie("token", token, cookieOptions)
    //   .status(200)
    //   .json({
    //     ok: true,
    //     message: "Login successful",
    //     user: {
    //       id: user._id,
    //       fullname: user.fullname,
    //       email: user.email,
    //       phoneNo: user.phoneNo,
    //       role: user.role,
    //       bio: user.bio,
    //       expertise: user.expertise,
    //       profile_image: user.profile_image,
    //     },
    //   });
    res.status(200).json({
      ok: true,
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        phoneNo: user.phoneNo,
        role: user.role,
        bio: user.bio,
        expertise: user.expertise,
        profile_image: user.profile_image,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: false, message: "Something went wrong" });
  }
};

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNo, password, role, bio, expertise } = req.body;

    if (!fullname || !email || !phoneNo || !password) {
      return res.status(400).json({ message: "Fullname, email, phone number and password are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phoneNo }] });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email or phone number already exists" });
    }

    if (role === "instructor" && (!bio || !expertise)) {
      return res.status(400).json({ message: "Bio and expertise are required for instructors" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      email,
      phoneNo,
      password: hashedPassword,
      role: role || "student",
      bio,
      expertise,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // res
    //   .cookie("token", token, cookieOptions)
    //   .status(201)
    //   .json({
    //     ok: true,
    //     message: "User registered successfully",
    //     user: {
    //       id: newUser._id,
    //       fullname: newUser.fullname,
    //       email: newUser.email,
    //       phoneNo: newUser.phoneNo,
    //       role: newUser.role,
    //       bio: newUser.bio,
    //       expertise: newUser.expertise,
    //       profile_image: newUser.profile_image,
    //     },
    //   });
    res.status(201).json({
      ok: true,
      message: "User registered successfully",
      token: token,
      user: {
        id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
        phoneNo: newUser.phoneNo,
        role: newUser.role,
        bio: newUser.bio,
        expertise: newUser.expertise,
        profile_image: newUser.profile_image,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
