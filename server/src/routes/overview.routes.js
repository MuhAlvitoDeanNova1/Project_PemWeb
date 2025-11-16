import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { getOverview } from "../controllers/overview.controller.js";

const router = Router();

// GET /overview
router.get("/", authRequired, getOverview);

export default router;