const express = require("express");
const {
  addToWardrobe,
  getMyWardrobe,
  removeFromWardrobe,
} = require("../controllers/wardrobeController");

const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", protect, addToWardrobe);
router.get("/", protect, getMyWardrobe);
router.delete("/:itemId", protect, removeFromWardrobe);

module.exports = router;