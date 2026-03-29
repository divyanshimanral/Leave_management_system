import express from "express";
import {
  getSummary,
  getLeaveTrends,
  getUserReport,
  exportReport,
} from "../controllers/reportController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/summary", protect, authorize(["Admin"]), getSummary);
router.get("/trends", protect, authorize(["Admin"]), getLeaveTrends);
router.get("/user/:id", protect, authorize(["Admin"]), getUserReport);
router.get("/export", protect, authorize(["Admin"]), exportReport);

export default router;
