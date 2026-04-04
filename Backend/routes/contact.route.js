import express from "express";
import {
  createContactRequest,
  getContactRequests,
  shareContactInfo,
} from "../controllers/contactController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getContactRequests);
router.post("/:itemId", createContactRequest);
router.post("/:id/share", shareContactInfo);

export default router;
