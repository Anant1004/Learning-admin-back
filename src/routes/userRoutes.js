import express from "express";
import { createUser, getUsers, getUserById, updateUser, deleteUser, loginUser } from "../controllers/userController.js";
const router = express.Router();
import {upload} from "../middlewares/multer.js"


router.post("/",upload.single("profile_image"), createUser);
router.post("/login",loginUser);    
router.get("/", getUsers);       
router.get("/:id", getUserById);   
router.put("/:id", updateUser);     
router.delete("/:id", deleteUser);   

export default router;
