import express from "express";
import {
  updateProfile,
  changePassword,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔥 PROFILE
router.put("/me", protect, updateProfile);

// 🔥 PASSWORD
router.put("/change-password", protect, changePassword);

export default router;
