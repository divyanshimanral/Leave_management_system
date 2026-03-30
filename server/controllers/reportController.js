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

// 📈 Monthly Trends
export const getMonthlyTrends = async (req, res) => {
  const data = await Leave.aggregate([
    {
      $group: {
        _id: { $month: "$startDate" },
        total: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json(data);
};

// 🟢 Status Distribution
export const getStatusStats = async (req, res) => {
  const data = await Leave.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  res.json(data);
};

// 👤 User-wise leaves
export const getUserStats = async (req, res) => {
  const data = await Leave.aggregate([
    // Step 1: Group by userId
    {
      $group: {
        _id: "$userId",
        totalLeaves: { $sum: 1 },
      },
    },

    // Step 2: Join with users collection
    {
      $lookup: {
        from: "users", // MUST match collection name
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },

    // Step 3: Flatten array
    {
      $unwind: "$user",
    },

    // Step 4: Replace ID with name
    {
      $project: {
        name: "$user.name", // ✅ use schema name
        totalLeaves: 1,
      },
    },
  ]);

  res.json(data);
};
