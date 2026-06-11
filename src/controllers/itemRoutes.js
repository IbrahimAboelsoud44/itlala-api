const express = require("express");
const { getItems } = require("../controllers/itemController");

const router = express.Router();

router.get("/", getItems);

module.exports = router;