import User from "../models/User.js";
import Trade from "../models/Trade.js";
import { getSimplePrice } from "../services/coingecko.js";

// mapping simbol -> id coingecko
const SYMBOL_MAP = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  BNB: "binancecoin",
  XRP: "ripple",
  DOGE: "dogecoin",
};

function mapSymbolToId(symbol) {
  const upper = symbol.toUpperCase();
  return SYMBOL_MAP[upper] || null;
}

export const getOverview = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    const trades = await Trade.find({ userId: req.userId });

    // kumpulkan posisi per symbol
    const positions = {};
    for (const t of trades) {
      const sym = t.symbol.toUpperCase();
      if (!positions[sym]) {
        positions[sym] = { symbol: sym, quantity: 0, totalBuyUSD: 0 };
      }
      if (t.side === "BUY") {
        positions[sym].quantity += t.quantity;
        positions[sym].totalBuyUSD += t.priceUSD * t.quantity;
      } else {
        positions[sym].quantity -= t.quantity;
        positions[sym].totalBuyUSD -= t.priceUSD * t.quantity;
      }
    }

    let portfolioValue = 0;
    let totalInvested = 0;

    // hitung nilai portfolio & total invest
    for (const sym of Object.keys(positions)) {
      const pos = positions[sym];
      if (pos.quantity <= 0) continue;

      const id = mapSymbolToId(sym);
      if (!id) continue;

      const priceNow = await getSimplePrice(id, "usd");
      const currentValue = pos.quantity * priceNow;

      portfolioValue += currentValue;
      totalInvested += pos.totalBuyUSD;
    }

    const balanceUSD = user.balanceUSD || 0;
    const totalAsset = balanceUSD + portfolioValue;
    const totalPL = portfolioValue - totalInvested; // unrealized P/L

    res.json({
      ok: true,
      overview: {
        balanceUSD,
        portfolioValueUSD: portfolioValue,
        totalAssetUSD: totalAsset,
        totalProfitLossUSD: totalPL,
      },
    });
  } catch (err) {
    console.error("Overview error:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};