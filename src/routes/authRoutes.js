const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { signupValidation, loginValidation } = require("../middleware/validation.middleware");
const {
  signup,
  login,
  getProfile,
  googleLogin,
  facebookLogin,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshToken,
} = require("../controllers/authController");




router.post("/signup", signupValidation, signup); 
router.post("/login", loginValidation, login);
router.get("/profile", protect, getProfile);
router.post("/google", googleLogin);
router.post("/facebook-login", facebookLogin);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/verify-email/:token", verifyEmail);
router.post("/refresh-token", refreshToken);

module.exports = router;