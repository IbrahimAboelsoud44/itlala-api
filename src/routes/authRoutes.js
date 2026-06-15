const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const { signupValidation, loginValidation } = require("../middleware/validation.middleware");
const {
  signup,
  login,
  getProfile,
  updateProfilePhoto,
  googleAuth,
  updateGender,
  forgotPassword,
  resetPassword,
  verifyEmail,
  refreshToken,
  deleteAccount,
} = require("../controllers/authController");

// Auth
router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
router.post("/google", googleAuth);

// Verification
router.get("/verify-email/:token", verifyEmail);

// Password
router.post("/forgot-password", forgotPassword);
router.put("/reset-password", protect, resetPassword);
router.post("/refresh-token", refreshToken);

// Profile
router.get("/profile", protect, getProfile);
router.put("/profile-photo", protect, updateProfilePhoto);
router.put("/gender", protect, updateGender);

// Account
router.delete("/delete-account", protect, deleteAccount);



module.exports = router;
