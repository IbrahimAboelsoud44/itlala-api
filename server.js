const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/db");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Load environment variables
dotenv.config();


console.log("JWT_SECRET =", process.env.JWT_SECRET);

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: "Too many requests, please try again later",
});
app.use(limiter);

// Routes
app.get("/", (req, res) => {
  res.send("API is running ");
});
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/items", require("./src/routes/itemRoutes"));
app.use("/api/wardrobe", require("./src/routes/wardrobeRoutes"));
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
