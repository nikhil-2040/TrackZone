const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/auth.route");

dotenv.config();
const app = express();

// ✅ CORS should come FIRST (before routes)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Middleware for JSON
app.use(express.json());

// ✅ Connect MongoDB
connectDB();

// ✅ Routes (after CORS)
app.use("/api/auth", authRoutes);

// ✅ Basic test route
app.get("/", (req, res) => {
  res.send("Server is running successfully 🔥");
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
