const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { signupValidation, loginValidation } = require("../middleware/validation.middleware");
const {
  signup,
  login,
  getProfile,
  googleAuth,
  updateGender,
  facebookLogin,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshToken,
  deleteAccount,
} = require("../controllers/authController");




router.post("/signup", signupValidation, signup); 
router.post("/login", loginValidation, login);
router.get("/profile", protect, getProfile);
router.post("/google", googleAuth);
router.put("/gender", protect, updateGender);
router.post("/facebook-login", facebookLogin);
router.post("/forgot-password", forgotPassword);
router.put(
  "/resetPassword",
  protect,
  resetPassword
);
router.get("/verify-email/:token", verifyEmail);
router.post("/refresh-token", refreshToken);
router.delete(
  "/delete-account",
  protect,
  deleteAccount
);

module.exports = router;
