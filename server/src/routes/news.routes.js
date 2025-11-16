import { Router } from "express";
import { getNews, getNewsBySymbol } from "../controllers/news.controller.js";

const router = Router();

// GET /news?symbol=btc&filter=hot
router.get("/", getNews);

// GET /news/btc   atau /news/eth
router.get("/:symbol", getNewsBySymbol);

export default router;