import express from "express";
import { getCurrentProfile, getUserProfile } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getCurrentProfile);
router.get("/:id", getUserProfile);

export default router;
