import express from "express";
import Leave from "../models/Leave.js"; // ✅ important

import {
  applyLeave,
  getMyLeaves,
  decideLeave,
  getMyStats,
  getCalendarData,
  getTeamLeaves,
  getAllLeaves,
} from "../controllers/leaveController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

/* ================= EMPLOYEE ================= */

router.post("/", protect, authorize(["Employee"]), applyLeave);

router.get(
  "/my",
  protect,
  authorize(["Employee", "Admin", "Manager"]),
  getMyLeaves
);

router.get("/my/stats", protect, authorize(["Employee", "Admin"]), getMyStats);

// ✅ FIXED STATS ROUTE
router.get("/stats/all", protect, authorize(["Admin"]), async (req, res) => {
  try {
    const total = await Leave.countDocuments();
    const approved = await Leave.countDocuments({ status: "Approved" });
    const pending = await Leave.countDocuments({ status: "Pending" });
    const rejected = await Leave.countDocuments({ status: "Rejected" });

    res.json({ total, approved, pending, rejected });
  } catch (err) {
    console.error(err); // 👈 important for debugging
    res.status(500).json({ message: "Server error" });
  }
});

router.get(
  "/my/calendar",
  protect,
  authorize(["Employee", "Admin"]),
  getCalendarData
);

/* ================= MANAGER ================= */

router.put("/:id/decision", protect, authorize(["Manager"]), decideLeave);

router.get("/team", protect, authorize(["Manager", "Admin"]), getTeamLeaves);

/* ================= ADMIN ================= */

router.get("/all", protect, authorize(["Admin", "Manager"]), getAllLeaves);

export default router;
