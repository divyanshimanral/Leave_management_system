import User from "../models/User.js";
import bcrypt from "bcryptjs";

// ✅ UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🔐 CHANGE PASSWORD
export const changePassword = async (req, res) => {
  try {
    const { current, new: newPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(current, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    const hash = await bcrypt.hash(newPassword, 10);

    user.passwordHash = hash;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
