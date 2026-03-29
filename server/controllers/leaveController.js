import Leave from "../models/Leave.js";

// POST /api/leave
export const applyLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;

    if (!startDate || !endDate || !reason) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    const leave = await Leave.create({
      userId: req.user.id,
      startDate,
      endDate,
      reason,
    });

    res.status(201).json(leave);
  } catch (err) {
    console.error("APPLY LEAVE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/leave/my?status=pending
export const getMyLeaves = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = { userId: req.user.id };

    if (status) {
      filter.status = status.charAt(0).toUpperCase() + status.slice(1);
    }

    const leaves = await Leave.find(filter).sort({ createdAt: -1 });

    res.json(leaves);
  } catch (err) {
    console.error("GET LEAVES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/leave/:id/decision
export const decideLeave = async (req, res) => {
  try {
    const { status } = req.body; // Approved / Rejected

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const leave = await Leave.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    leave.status = status;
    leave.reviewedBy = req.user.id;
    leave.reviewedAt = new Date();

    await leave.save();

    res.json({ message: "Leave updated", leave });
  } catch (err) {
    console.error("DECISION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/leave/my/stats
export const getMyStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const total = await Leave.countDocuments({ userId });
    const approved = await Leave.countDocuments({ userId, status: "Approved" });
    const pending = await Leave.countDocuments({ userId, status: "Pending" });
    const rejected = await Leave.countDocuments({ userId, status: "Rejected" });

    res.json({ total, approved, pending, rejected });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/leave/my/calendar
export const getCalendarData = async (req, res) => {
  try {
    const leaves = await Leave.find({
      userId: req.user.id,
    });

    const formatted = leaves.map((l) => ({
      startDate: l.startDate,
      endDate: l.endDate,
      status: l.status,
    }));

    res.json(formatted);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// GET TEAM LEAVES (Manager)
export const getTeamLeaves = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};

    if (status) {
      filter.status = status.charAt(0).toUpperCase() + status.slice(1);
    }

    const leaves = await Leave.find(filter)
      .populate("userId", "name email role")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch (err) {
    console.error("TEAM LEAVES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL LEAVES (Admin)
export const getAllLeaves = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};

    if (status) {
      filter.status = status.charAt(0).toUpperCase() + status.slice(1);
    }

    const leaves = await Leave.find(filter)
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(leaves);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
