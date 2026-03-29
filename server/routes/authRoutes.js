import express from "express";
import { login, register, inviteUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// 🔥 Invite (Admin + Manager)
router.post("/invite", protect, authorize(["Admin", "Manager"]), inviteUser);

export default router;
