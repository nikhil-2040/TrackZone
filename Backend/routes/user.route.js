const express = require("express");
const { getCurrentProfile, getUserProfile } = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protect, getCurrentProfile);
router.get("/:id", getUserProfile);

module.exports = router;
