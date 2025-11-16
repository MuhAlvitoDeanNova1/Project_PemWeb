import { getMultipleMarkets } from "../services/coingecko.js";

// mapping simbol -> id coingecko (pake yg sama dengan trade/overview)
const SYMBOL_MAP = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  BNB: "binancecoin",
  XRP: "ripple",
  DOGE: "dogecoin",
};

function mapSymbolsToIds(symbols) {
  const arr = symbols
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean);

  const ids = [];
  const unresolved = [];

  for (const sym of arr) {
    const id = SYMBOL_MAP[sym];
    if (id) ids.push({ sym, id });
    else unresolved.push(sym);
  }

  return { ids, unresolved };
}

// GET /compare?symbols=BTC,ETH,SOL
export const compareCoins = async (req, res) => {
  try {
    const { symbols } = req.query;

    if (!symbols) {
      return res.status(400).json({
        ok: false,
        message: "symbols query is required, e.g. ?symbols=BTC,ETH,SOL",
      });
    }

    const rawSymbols = symbols.split(",");
    const { ids, unresolved } = mapSymbolsToIds(rawSymbols);

    if (!ids.length) {
      return res.status(400).json({
        ok: false,
        message: "No valid symbols provided",
      });
    }

    const marketIds = ids.map((item) => item.id);
    const markets = await getMultipleMarkets(marketIds, "usd");

    // bentuk respons sederhana & siap pakai di frontend
    const result = markets.map((coin) => ({
      id: coin.id,                     // "bitcoin"
      symbol: coin.symbol.toUpperCase(), // "BTC"
      name: coin.name,
      price: coin.current_price,
      marketCap: coin.market_cap,
      volume24h: coin.total_volume,
      change1h: coin.price_change_percentage_1h_in_currency,
      change24h: coin.price_change_percentage_24h_in_currency,
      change7d: coin.price_change_percentage_7d_in_currency,
      image: coin.image,
    }));

    res.json({
      ok: true,
      compared: result,
      unresolved, // symbol yang belum dimapping (kalau ada)
    });
  } catch (err) {
    console.error("Compare error:", err.message);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};