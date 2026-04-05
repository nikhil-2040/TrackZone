const express = require("express");
const {
  createContactRequest,
  getContactRequests,
  shareContactInfo,
} = require("../controllers/contactController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getContactRequests);
router.post("/:itemId", createContactRequest);
router.post("/:id/share", shareContactInfo);

module.exports = router;
