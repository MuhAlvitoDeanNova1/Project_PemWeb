import { Router } from "express";
import { compareCoins } from "../controllers/compare.controller.js";

const router = Router();

// GET /compare?coins=bitcoin,ethereum,solana
router.get("/", compareCoins);

export default router;