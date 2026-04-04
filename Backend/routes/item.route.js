import express from "express";
import {
  createItem,
  deleteItem,
  getItemById,
  getItems,
  matchItems,
  updateItem,
} from "../controllers/itemController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getItems);
router.post("/match", matchItems);
router.get("/:id", getItemById);
router.post("/", protect, createItem);
router.put("/:id", protect, updateItem);
router.delete("/:id", protect, deleteItem);

export default router;
