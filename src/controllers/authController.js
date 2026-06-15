
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const axios = require("axios");
const cloudinary = require("../config/cloudinary");
const User = require("../models/User");
const Wardrobe = require("../models/Wardrobe");


// Generate JWT
const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });
};

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, gender, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(20).toString("hex");

    const user = await User.create({
      name,
      email,
      gender,
      password: hashedPassword,
      verificationToken,
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.status(201).json({ message: "User created", accessToken, user: {
    id: user._id,
    name: user.name,
    email: user.email,
    gender: user.gender,
    photo: user.photo
  } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.json({ 
      message:"login successful",
      accessToken, user: {
    id: user._id,
    name: user.name,
    email: user.email,
    gender: user.gender,
  } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// profile
exports.getProfile = async (req, res) => {
  try {
    const user = req.user;

    const wardrobe = await Wardrobe.findOne({ user: user._id });

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        wardrobeCount: wardrobe ? wardrobe.items.length : 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

//Update profileName
exports.updateName = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: name.trim(),
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Name updated successfully",
      name: user.name,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update profilePhoto
exports.updateProfilePhoto = async (req, res) => {
  try {

    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        message: "imageBase64 is required"
      });
    }

    const uploadResult = await cloudinary.uploader.upload(
      imageBase64,
      {
        folder: "itlala/profile-images"
      }
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        photo: uploadResult.secure_url
      },
      {
        new: true
      }
    );

    res.status(200).json({
      success: true,
      message: "Profile photo updated successfully",
      photo: user.photo
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
// Google Login
exports.googleAuth = async (req, res) => {
  try {

    const { name, email, photo } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });

    // Create user if not exists
    if (!user) {

      user = await User.create({
        name,
        email,
        

        // Google users don't have password
        password: null,

        // Optional
        photo,

        // gender will be chosen later
        gender: null,
        provider: "google"
      });
    }

    // Generate token
    const accessToken = generateAccessToken(user._id);

    res.status(200).json({
      success: true,

      accessToken,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        photo: user.photo
        
      }
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// Update Gender
exports.updateGender = async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        gender: req.body.gender
      },
      {
        new: true
      }
    );

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 دقائق

    await user.save();


res.json({ message: "Reset token generated", resetToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    user.password = await bcrypt.hash(
      newPassword,
      10
    );

    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
// Delete Acount
exports.deleteAccount = async (req, res) => {
  try {

    // Delete user's wardrobe items
    
    await Wardrobe.deleteMany({
      user: req.user.id
    });

    // Delete user account
    await User.findByIdAndDelete(req.user.id);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
// Verify Email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });
    if (!user) return res.status(400).json({ message: "Invalid token" });

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Refresh Token
exports.refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    const accessToken = generateAccessToken(decoded.id);

    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
};
