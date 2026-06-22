const User = require("../models/User");

exports.trackModelUsage = async (req, res) => {
  try {
    const { model } = req.body;

    const allowedModels = [
      "classification",
      "recommendation",
      "virtualTryOn",
      "avatar",
    ];

    if (!allowedModels.includes(model)) {
      return res.status(400).json({
        success: false,
        message: "Invalid model name",
      });
    }

    await User.findByIdAndUpdate(
      req.user.id,
      {
        $inc: {
          [`modelUsage.${model}`]: 1,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Usage tracked successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
