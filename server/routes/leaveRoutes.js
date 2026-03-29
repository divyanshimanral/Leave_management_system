import express from "express";
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

// Apply leave → only Employee
router.post("/", protect, authorize(["Employee"]), applyLeave);

// My data → Employee + Admin (Admin can inspect users)
router.get(
  "/my",
  protect,
  authorize(["Employee", "Admin", "Manager"]),
  getMyLeaves
);
router.get("/my/stats", protect, authorize(["Employee", "Admin"]), getMyStats);
router.get(
  "/my/calendar",
  protect,
  authorize(["Employee", "Admin"]),
  getCalendarData
);

/* ================= MANAGER ================= */

// Approve / Reject → only Manager
router.put("/:id/decision", protect, authorize(["Manager"]), decideLeave);

// Team leaves → Manager + Admin
router.get("/team", protect, authorize(["Manager", "Admin"]), getTeamLeaves);

/* ================= ADMIN ================= */

// All leaves → only Admin
router.get("/all", protect, authorize(["Admin"]), getAllLeaves);

export default router;
