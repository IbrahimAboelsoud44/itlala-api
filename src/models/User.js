const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      default: null,
    },
    photo: {
  type: String, 
    },
    gender: {
  type: String,
  enum: ['male', 'female'],
  default: null,
    },
    provider: {
      type: String,
      default: "local", // local / google / facebook
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    modelUsage: {
  classification: {
    type: Number,
    default: 0,
  },
  recommendation: {
    type: Number,
    default: 0,
  },
  virtualTryOn: {
    type: Number,
    default: 0,
  },
  avatar: {
    type: Number,
    default: 0,
  },
},
    
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
