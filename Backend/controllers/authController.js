const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // 👇 Console log for terminal view
    console.log("\n✅ [REGISTER SUCCESS]");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("User ID:", user._id);
    console.log("-----------------------------");

    return res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Register Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 👇 Console log for terminal view
    console.log("\n🔐 [LOGIN SUCCESS]");
    console.log("Name:", user.name);
    console.log("Email:", user.email);
    console.log("User ID:", user._id);
    console.log("-----------------------------");

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
