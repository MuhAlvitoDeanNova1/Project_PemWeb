import axios from "axios";

const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

export async function compareCoins(req, res) {
  try {
    // ?coins=bitcoin,ethereum,solana (default)
    const coinsParam = req.query.coins || "bitcoin,ethereum,solana";

    const ids = coinsParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .join(",");

    const { data } = await axios.get(`${COINGECKO_BASE}/coins/markets`, {
      params: {
        vs_currency: "usd",
        ids,
        price_change_percentage: "24h,7d",
        per_page: 10,
        page: 1,
      },
    });

    const mapped = data.map((c) => ({
      id: c.id,
      symbol: c.symbol.toUpperCase(),
      name: c.name,
      image: c.image,
      currentPrice: c.current_price,
      change24h: c.price_change_percentage_24h,
      change7d: c.price_change_percentage_7d_in_currency,
      marketCap: c.market_cap,
      volume24h: c.total_volume,
    }));

    res.json({ ok: true, coins: mapped });
  } catch (err) {
    console.error("Error compareCoins:", err.message);
    res.status(500).json({
      ok: false,
      message: "Gagal mengambil data perbandingan coin",
    });
  }
}