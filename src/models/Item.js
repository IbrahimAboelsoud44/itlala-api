const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    category: { type: String, required: true },
    subcategory: String,
    gender: {
      type: String,
      enum: ["men", "women", "kids"],
      required: true,
    },
    usage: String,
    material: String,
    pattern: String,
    fit: String,
    sleeve: String,
    colors: [String],
    season: [String],
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);