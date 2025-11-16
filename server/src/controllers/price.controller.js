import {
  getTopMarkets,
  getCoinDetail,
  getCoinMarketChart,
} from "../services/coingecko.js";

export const getMarkets = async (req, res) => {
  try {
    const { vs = "usd", limit = 6 } = req.query;
    const data = await getTopMarkets(vs, Number(limit));
    res.json({ ok: true, data });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ ok: false, message: "Failed to fetch markets" });
  }
};

export const getCoin = async (req, res) => {
  try {
    const { id } = req.params; // misal: bitcoin, ethereum, solana
    const data = await getCoinDetail(id);
    res.json({ ok: true, data });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ ok: false, message: "Failed to fetch coin detail" });
  }
};

export const getCoinChart = async (req, res) => {
  try {
    const { id } = req.params;
    const { days = 1, vs = "usd" } = req.query;
    const data = await getCoinMarketChart(id, days, vs);
    res.json({ ok: true, data });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ ok: false, message: "Failed to fetch coin chart" });
  }
};