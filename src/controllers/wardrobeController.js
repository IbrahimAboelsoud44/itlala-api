const Wardrobe = require("../models/Wardrobe");
const Item = require("../models/Item");
const cloudinary = require("../config/cloudinary");

// Add item
exports.addToWardrobe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.body;

    // check if item exists 
    const itemExists = await Item.findById(itemId);
    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    // find user's wardrobe
    let wardrobe = await Wardrobe.findOne({ user: userId });

    if (!wardrobe) {
      wardrobe = await Wardrobe.create({
        user: userId,
        items: [itemId],
      });
    } else {
      // prevent dublicate itrms 
      if (wardrobe.items.includes(itemId)) {
        return res.status(400).json({
          success: false,
          message: "Item already in wardrobe",
        });
      }

      wardrobe.items.push(itemId);
      await wardrobe.save();
    }

    res.status(200).json({
      success: true,
      message: "Item added to wardrobe",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Veiw user's items

exports.getMyWardrobe = async (req, res) => {
  try {
    const userId = req.user.id;

    const wardrobe = await Wardrobe.findOne({ user: userId })
      .populate("items");// 

    if (!wardrobe) {
      return res.status(200).json({
        success: true,
        count: 0,
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      count: wardrobe.items.length,
      data: wardrobe.items,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete user's item
exports.removeFromWardrobe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;

    const wardrobe = await Wardrobe.findOne({ user: userId });

    if (!wardrobe) {
      return res.status(404).json({
        success: false,
        message: "Wardrobe not found",
      });
    }

    wardrobe.items = wardrobe.items.filter(
      (item) => item.toString() !== itemId
    );

    await wardrobe.save();

    res.status(200).json({
      success: true,
      message: "Item removed from wardrobe",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Custum wardrobe
exports.addCustomItem = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      category,
      subcategory,
      gender,
      material,
      pattern,
      fit,
      sleeve,
      colors,
      season,
      description,
      imageBase64,
    } = req.body;

    //Validation
if (!imageBase64) {
  return res.status(400).json({
    success: false,
    message: "imageBase64 is required",
  });
}

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(
      imageBase64,
      {
        folder: "itlala/custom",
      }
    );

    // Create item
    const item = await Item.create({
      imageUrl: uploadResult.secure_url,
      category,
      subcategory,
      gender,
      material,
      pattern,
      fit,
      sleeve,
      colors,
      season,
      description,
    });

    // Find wardrobe
    let wardrobe = await Wardrobe.findOne({
      user: userId,
    });

    if (!wardrobe) {
      wardrobe = await Wardrobe.create({
        user: userId,
        items: [item._id],
      });
    } else {
      wardrobe.items.push(item._id);
      await wardrobe.save();
    }

    res.status(201).json({
      success: true,
      message: "Custom item added successfully",
      item,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
