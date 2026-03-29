import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/token.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // ✅ Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Normalize role (IMPORTANT FIX)
    const validRoles = ["Employee", "Manager", "Admin"];
    const userRole = validRoles.includes(role) ? role : "Employee";

    // ✅ Check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ✅ Hash password
    const hash = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = await User.create({
      name,
      email,
      passwordHash: hash,
      role: userRole,
    });

    // ✅ Send safe response (NO password)
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user),
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err); // 🔥 VERY IMPORTANT
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token: generateToken(user),
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// INVITE USER (Admin / Manager)
export const inviteUser = async (req, res) => {
  try {
    const { email, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    // temporary password
    const tempPassword = "123456";
    const hash = await bcrypt.hash(tempPassword, 10);

    const user = await User.create({
      name: "Invited User",
      email,
      passwordHash: hash,
      role,
      invitedBy: req.user.id,
    });

    res.json({
      message: "User invited successfully",
      user,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
