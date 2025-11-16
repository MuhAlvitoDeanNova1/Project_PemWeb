import { Router } from "express";
import { register, verifyEmail, login, me } from "../controllers/auth.controller.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

// POST /auth/register
router.post("/register", register);

// GET /auth/verify/:token
router.get("/verify/:token", verifyEmail);

// POST /auth/login
router.post("/login", login);

router.get("/me", authRequired, me);

export default router;