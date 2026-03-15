const Item = require("../models/Item");

exports.getItems = async (req, res) => {
  try {
    const { page = 1, limit = 20, ...filters } = req.query;

    const query = {};

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      // // If the value contains comma, apply multi-value filtering
      if (value.includes(",")) {
        query[key] = { $in: value.split(",") };
      } else {
        query[key] = value;
      }
    });

    const skip = (page - 1) * limit;

    const items = await Item.find(query)
      .skip(skip)
      .limit(Number(limit));

    const total = await Item.countDocuments(query);

    res.json({
      success: true,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      total,
      count: items.length,
      data: items,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch items",
    });
  }
};