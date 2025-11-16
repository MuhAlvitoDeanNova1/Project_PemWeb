import Trade from "../models/Trade.js";
import User from "../models/User.js";
import { getSimplePrice } from "../services/coingecko.js";

// helper mapping symbol -> coingecko id
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

// POST /trade
export const createTrade = async (req, res) => {
  try {
    const { symbol, side, quantity } = req.body;
    const qty = Number(quantity);

    if (!symbol || !side || !qty || qty <= 0) {
      return res.status(400).json({ ok: false, message: "Invalid trade data" });
    }

    if (!["BUY", "SELL"].includes(side)) {
      return res.status(400).json({ ok: false, message: "Side must be BUY or SELL" });
    }

    const coingeckoId = mapSymbolToId(symbol);
    if (!coingeckoId) {
      return res.status(400).json({ ok: false, message: "Unsupported symbol" });
    }

    // cari user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    // ambil harga realtime
    const priceUSD = await getSimplePrice(coingeckoId, "usd");
    const totalUSD = priceUSD * qty;

    // hitung posisi user untuk SELL
    if (side === "SELL") {
      const trades = await Trade.find({ userId: user._id, symbol: symbol.toUpperCase() });

      const netQty = trades.reduce((acc, t) => {
        return acc + (t.side === "BUY" ? t.quantity : -t.quantity);
      }, 0);

      if (netQty < qty) {
        return res.status(400).json({
          ok: false,
          message: `Not enough ${symbol} to sell. Current qty: ${netQty}`,
        });
      }

      // tambahkan saldo
      user.balanceUSD += totalUSD;
    } else if (side === "BUY") {
      // cek saldo cukup
      if (user.balanceUSD < totalUSD) {
        return res.status(400).json({
          ok: false,
          message: "Insufficient balance",
        });
      }
      user.balanceUSD -= totalUSD;
    }

    // simpan trade
    const trade = await Trade.create({
      userId: user._id,
      symbol: symbol.toUpperCase(),
      side,
      quantity: qty,
      priceUSD,
    });

    await user.save();

    res.json({
      ok: true,
      message: "Trade executed",
      trade,
      balanceUSD: user.balanceUSD,
    });
  } catch (err) {
    console.error("Trade error:", err.message);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};

// GET /trade/history
export const getHistory = async (req, res) => {
  try {
    const trades = await Trade.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json({ ok: true, trades });
  } catch (err) {
    console.error("History error:", err.message);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};

// GET /trade/portfolio
export const getPortfolio = async (req, res) => {
  try {
    const trades = await Trade.find({ userId: req.userId });

    // akumulasi qty per symbol
    const positions = {};
    for (const t of trades) {
      const sym = t.symbol.toUpperCase();
      if (!positions[sym]) {
        positions[sym] = { symbol: sym, quantity: 0, avgBuyPrice: 0, totalBuyUSD: 0 };
      }
      if (t.side === "BUY") {
        positions[sym].quantity += t.quantity;
        positions[sym].totalBuyUSD += t.priceUSD * t.quantity;
      } else if (t.side === "SELL") {
        positions[sym].quantity -= t.quantity;
        positions[sym].totalBuyUSD -= t.priceUSD * t.quantity; // simplifikasi
      }
    }

    // hitung avgBuyPrice & nilai sekarang (optional)
    const symbols = Object.keys(positions).filter((s) => positions[s].quantity > 0);

    // ambil harga sekarang untuk semua symbol
    const result = [];
    for (const sym of symbols) {
      const id = mapSymbolToId(sym);
      if (!id) continue;
      const priceNow = await getSimplePrice(id, "usd");
      const pos = positions[sym];

      const avgBuyPrice =
        pos.quantity > 0 ? pos.totalBuyUSD / pos.quantity : 0;
      const currentValue = pos.quantity * priceNow;
      const profitLoss = currentValue - pos.totalBuyUSD;

      result.push({
        symbol: sym,
        quantity: pos.quantity,
        avgBuyPrice,
        priceNow,
        currentValue,
        profitLoss,
      });
    }

    res.json({ ok: true, positions: result });
  } catch (err) {
    console.error("Portfolio error:", err.message);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};