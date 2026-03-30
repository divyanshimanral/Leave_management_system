import express from "express";
import {
  getSummary,
  getLeaveTrends,
  getUserReport,
  exportReport,
  getMonthlyTrends,
  getStatusStats,
  getUserStats,
} from "../controllers/reportController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/summary", protect, authorize(["Admin"]), getSummary);
router.get("/trends", protect, authorize(["Admin"]), getLeaveTrends);
router.get("/user/:id", protect, authorize(["Admin"]), getUserReport);
router.get("/export", protect, authorize(["Admin"]), exportReport);
// Only Admin can access reports
router.get("/monthly", protect, authorize(["Admin"]), getMonthlyTrends);
router.get("/status", protect, authorize(["Admin"]), getStatusStats);
router.get("/users", protect, authorize(["Admin"]), getUserStats);

export default router;
