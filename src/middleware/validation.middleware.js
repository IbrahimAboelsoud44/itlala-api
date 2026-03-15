const { body, validationResult } = require("express-validator");

exports.signupValidation = [
  body("name").notEmpty(),
  body("email").isEmail(),
  body("gender").notEmpty().isIn(["male", "female"]),
  body("password").isLength({ min: 6 }),


  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
    
      return res.status(400).json({
        success: false,
        message: "Please fill all fields correctly )"
      });
    }
    next();
  },
];

exports.loginValidation = [
  body("email").isEmail(),
  body("password").notEmpty(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }
    next();
  },
];