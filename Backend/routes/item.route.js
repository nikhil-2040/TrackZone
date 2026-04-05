const express = require("express");
const {
  createItem,
  deleteItem,
  getItemById,
  getItems,
  matchItems,
  updateItem,
} = require("../controllers/itemController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getItems);
router.post("/match", matchItems);
router.get("/:id", getItemById);
router.post("/", protect, createItem);
router.put("/:id", protect, updateItem);
router.delete("/:id", protect, deleteItem);

module.exports = router;
