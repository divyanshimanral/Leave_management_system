import User from "../models/User.js";

// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.json(users);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE ROLE
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();

    res.json({ message: "Role updated", user });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
