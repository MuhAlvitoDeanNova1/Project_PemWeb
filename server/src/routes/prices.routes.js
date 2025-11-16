import { Router } from "express";
import { getMarkets, getCoin, getCoinChart } from "../controllers/price.controller.js";

const router = Router();

// daftar market (untuk card BTC, ETH, SOL di dashboard)
router.get("/markets", getMarkets);

// detail coin
router.get("/:id", getCoin);

// data chart (untuk grafik utama)
router.get("/:id/chart", getCoinChart);

export default router;