import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import {
  createTrade,
  getHistory,
  getPortfolio,
} from "../controllers/trade.controller.js";

const router = Router();

router.post("/", authRequired, createTrade);
router.get("/history", authRequired, getHistory);
router.get("/portfolio", authRequired, getPortfolio);

export default router;