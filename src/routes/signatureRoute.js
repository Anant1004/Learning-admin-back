import express from "express";
import {
    generateSignature,
    deleteMaterial
} from "../controllers/signatureController.js";

const router = express.Router();
router.get("/", generateSignature);
router.post("/",deleteMaterial);

export default router;
