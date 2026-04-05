const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");

// ✅ Import all routes
const authRoutes = require("./routes/auth.route");
const itemRoutes = require("./routes/item.route");
const userRoutes = require("./routes/user.route");
const contactRoutes = require("./routes/contact.route");

dotenv.config();
const app = express();

// ✅ CORS Configuration - Allow both development and production origins
const allowedOrigins = [
  "http://localhost:5173", // Development frontend
  "https://trackzone3.vercel.app", // Production frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Enable cookies/auth headers
  optionsSuccessStatus: 200, // For legacy browsers
};

// ✅ CORS should come FIRST (before routes)
app.use(cors(corsOptions));

// ✅ Middleware for JSON
app.use(express.json());

// ✅ Connect MongoDB
connectDB();

// ✅ Routes (after CORS and middleware)
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contact-requests", contactRoutes);

// ✅ Basic test route
app.get("/", (req, res) => {
  res.send("Server is running successfully 🔥");
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
