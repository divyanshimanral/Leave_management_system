import express from "express";
import {
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, authorize(["Admin"]), getAllUsers);
router.put("/:id/role", protect, authorize(["Admin"]), updateUserRole);
router.delete("/:id", protect, authorize(["Admin"]), deleteUser);

export default router;
