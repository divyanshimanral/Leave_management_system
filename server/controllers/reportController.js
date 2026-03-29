import Leave from "../models/Leave.js";
import User from "../models/User.js";

export const getSummary = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalLeaves = await Leave.countDocuments();
    const pending = await Leave.countDocuments({ status: "Pending" });
    const approved = await Leave.countDocuments({ status: "Approved" });
    const rejected = await Leave.countDocuments({ status: "Rejected" });

    res.json({
      totalUsers,
      totalLeaves,
      pending,
      approved,
      rejected,
    });
  } catch (err) {
    console.error("SUMMARY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getLeaveTrends = async (req, res) => {
  try {
    const data = await Leave.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const formatted = data.map((item) => ({
      month: item._id,
      leaves: item.count,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("TRENDS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserReport = async (req, res) => {
  try {
    const userId = req.params.id;

    const leaves = await Leave.find({ userId });

    const total = leaves.length;
    const approved = leaves.filter((l) => l.status === "Approved").length;
    const pending = leaves.filter((l) => l.status === "Pending").length;
    const rejected = leaves.filter((l) => l.status === "Rejected").length;

    res.json({
      total,
      approved,
      pending,
      rejected,
      leaves,
    });
  } catch (err) {
    console.error("USER REPORT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const exportReport = async (req, res) => {
  try {
    const leaves = await Leave.find().populate("userId", "name email");

    const formatted = leaves.map((l) => ({
      name: l.userId.name,
      email: l.userId.email,
      startDate: l.startDate,
      endDate: l.endDate,
      status: l.status,
    }));

    res.json(formatted);
  } catch (err) {
    console.error("EXPORT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
