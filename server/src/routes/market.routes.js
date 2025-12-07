import { Router } from "express";
import axios from "axios";

const router = Router();

// cache sederhana biar nggak kena limit
const cache = {};
const TTL_MS = 60 * 1000; // 1 menit

function mapRangeToDays(range) {
  switch (range) {
    case "1D":
      return 1;
    case "1W":
      return 7;
    case "1M":
      return 30;
    default:
      return null;
  }
}

router.get("/", async (req, res) => {
  try {
    const coin = (req.query.coin || "bitcoin").toLowerCase(); // bitcoin, ethereum, solana, dll.
    const range = (req.query.range || "1D").toUpperCase(); // 1D, 1W, 1M
    const days = mapRangeToDays(range);

    if (!days) {
      return res.status(400).json({
        ok: false,
        message: "Range tidak valid. Gunakan 1D, 1W, atau 1M.",
      });
    }

    const cacheKey = `${coin}-${range}`;
    const now = Date.now();

    if (cache[cacheKey] && now - cache[cacheKey].timestamp < TTL_MS) {
      return res.json({
        ok: true,
        coin,
        range,
        points: cache[cacheKey].data,
        source: "cache",
      });
    }

    const url = `https://api.coingecko.com/api/v3/coins/${coin}/market_chart`;

    const cgRes = await axios.get(url, {
      params: {
        vs_currency: "usd",
        days,
      },
    });

    const prices = cgRes.data?.prices || [];
    // prices = [ [timestamp_ms, price], ... ]

    const points = prices.map(([ts, price]) => ({
      ts, // timestamp dalam ms
      price,
    }));

    cache[cacheKey] = {
      timestamp: now,
      data: points,
    };

    return res.json({
      ok: true,
      coin,
      range,
      points,
      source: "live",
    });
  } catch (err) {
    console.error(
      "Error fetching market chart:",
      err.response?.status,
      err.message
    );
    return res.status(500).json({
      ok: false,
      message: "Gagal mengambil data historis harga",
    });
  }
});

export default router;