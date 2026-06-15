const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const { trackModelUsage } = require("../controllers/statsController");

const router = express.Router();

router.post("/model-usage", protect, trackModelUsage);

module.exports = router;