import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { compareCoins } from "../controllers/compare.controller.js";

const router = Router();

// boleh aja compare tanpa login, tapi kalau mau khusus user, pakai authRequired
router.get("/", authRequired, compareCoins);

export default router;