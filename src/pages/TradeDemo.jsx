import React, { useEffect, useState } from "react";
import { DollarSign, ArrowLeftRight, TrendingUp } from "lucide-react";
import { getPrices, createTrade, getTradeHistory } from "../services/api";

const COINS = [
  { id: "bitcoin", symbol: "BTC", label: "Bitcoin (BTC)" },
  { id: "ethereum", symbol: "ETH", label: "Ethereum (ETH)" },
  { id: "solana", symbol: "SOL", label: "Solana (SOL)" },
];

// saldo awal demo
const INITIAL_CASH = 10000;

export default function TradeDemo({ token }) {
  const [prices, setPrices] = useState(null);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [errorPrices, setErrorPrices] = useState("");

  const [selectedCoin, setSelectedCoin] = useState("bitcoin");
  const [side, setSide] = useState("BUY");
  const [quantity, setQuantity] = useState("");

  const [trades, setTrades] = useState([]);
  const [tradesLoading, setTradesLoading] = useState(false);
  const [tradesError, setTradesError] = useState("");

  useEffect(() => {
    if (!token) return;

    const fetchAll = async () => {
      // harga
      try {
        setLoadingPrices(true);
        setErrorPrices("");
        const data = await getPrices();
        setPrices(data);
      } catch (err) {
        setErrorPrices(err.message || "Gagal mengambil harga");
      } finally {
        setLoadingPrices(false);
      }

      // riwayat trade dari backend
      try {
        setTradesLoading(true);
        setTradesError("");
        const history = await getTradeHistory(token);
        setTrades(history);
      } catch (err) {
        setTradesError(err.message || "Gagal mengambil riwayat trade");
      } finally {
        setTradesLoading(false);
      }
    };

    fetchAll();
  }, [token]);

  const getCurrentPrice = (coinId) => {
    if (!prices) return null;
    return prices[coinId]?.usd ?? null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const qtyNum = parseFloat(quantity);
    if (isNaN(qtyNum) || qtyNum <= 0) return;

    const coinMeta = COINS.find((c) => c.id === selectedCoin);

    const payload = {
      symbol: coinMeta.symbol, // "BTC" | "ETH" | "SOL"
      side,
      quantity: qtyNum,
      // priceUSD akan diisi di backend
    };

    try {
      const saved = await createTrade(token, payload);
      setTrades((prev) => [saved, ...prev]);
      setQuantity("");
    } catch (err) {
      alert(err.message || "Gagal menyimpan trade");
    }
  };

  // ====== PERHITUNGAN PORTFOLIO & BALANCE ======
  const portfolio = COINS.map((coin) => {
    const currentPrice = getCurrentPrice(coin.id) || 0;

    let netQty = 0;
    let pnl = 0;

    trades
      .filter((t) => t.symbol === coin.symbol)
      .forEach((t) => {
        const sign = t.side === "BUY" ? 1 : -1;
        netQty += sign * t.quantity;

        const entryPrice = t.priceUSD || 0;
        pnl += (currentPrice - entryPrice) * t.quantity * sign;
      });

    return {
      ...coin,
      currentPrice,
      netQty,
      valueNow: netQty * currentPrice,
      pnl,
    };
  });

  const totalPortfolioValue = portfolio.reduce(
    (sum, c) => sum + c.valueNow,
    0
  );
  const totalPnl = portfolio.reduce((sum, c) => sum + c.pnl, 0);

  // hitung demo cash balance berdasarkan semua trade
  const cashBalance = trades.reduce((cash, t) => {
    const tradeValue = (t.priceUSD || 0) * t.quantity;
    if (t.side === "BUY") {
      return cash - tradeValue;
    } else {
      // SELL
      return cash + tradeValue;
    }
  }, INITIAL_CASH);

  const totalEquity = cashBalance + totalPortfolioValue;

  const formatMoney = (v) =>
    typeof v === "number"
      ? `$${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
      : "-";

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-emerald-400 flex items-center gap-2">
              <ArrowLeftRight className="w-6 h-6" />
              Trade Demo
            </h1>
            <p className="text-sm text-gray-400 mt-1">
            </p>
          </div>
        </header>

        {/* Overview: Balance & Portfolio */}
        <section className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-1">Demo Cash Balance</p>
            <p className="text-2xl font-semibold">
              {formatMoney(cashBalance)}
            </p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-1">Portfolio Value</p>
            <p className="text-2xl font-semibold">
              {formatMoney(totalPortfolioValue)}
            </p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-1">Total Equity (Cash + Aset)</p>
            <p className="text-2xl font-semibold">
              {formatMoney(totalEquity)}
            </p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-1">Total Unrealized P/L</p>
            <p
              className={`text-2xl font-semibold ${
                totalPnl >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {formatMoney(totalPnl)}
            </p>
          </div>
        </section>

        {/* Form trade */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            Input Transaksi Demo
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            <div>
              <label className="block text-xs text-gray-300 mb-1">Aset</label>
              <select
                value={selectedCoin}
                onChange={(e) => setSelectedCoin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {COINS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-300 mb-1">Side</label>
              <div className="flex rounded-xl overflow-hidden border border-slate-700">
                <button
                  type="button"
                  onClick={() => setSide("BUY")}
                  className={`flex-1 py-2 text-sm font-semibold ${
                    side === "BUY"
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-950 text-gray-300"
                  }`}
                >
                  BUY
                </button>
                <button
                  type="button"
                  onClick={() => setSide("SELL")}
                  className={`flex-1 py-2 text-sm font-semibold ${
                    side === "SELL"
                      ? "bg-red-500 text-white"
                      : "bg-slate-950 text-gray-300"
                  }`}
                >
                  SELL
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-300 mb-1">
                Jumlah (Qty)
              </label>
              <input
                type="number"
                step="0.0001"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="contoh: 0.01"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl py-2.5 flex items-center justify-center gap-2 transition"
              >
                <TrendingUp className="w-4 h-4" />
                Simpan Transaksi Demo
              </button>
            </div>
          </form>
        </section>

        {/* Riwayat trade */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
          <h2 className="text-lg font-semibold mb-3">Riwayat Transaksi Demo</h2>

          {tradesLoading && (
            <p className="text-sm text-gray-400 mb-2">
              Mengambil riwayat transaksi...
            </p>
          )}
          {tradesError && (
            <p className="text-sm text-red-400 mb-2">{tradesError}</p>
          )}

          {trades.length === 0 && !tradesLoading && !tradesError ? (
            <p className="text-sm text-gray-400">
              Belum ada transaksi. Tambahkan transaksi demo di atas.
            </p>
          ) : null}

          {trades.length > 0 && (
            <div className="overflow-x-auto text-sm">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-xs text-gray-400">
                    <th className="py-2 pr-4">Waktu</th>
                    <th className="py-2 pr-4">Aset</th>
                    <th className="py-2 pr-4">Side</th>
                    <th className="py-2 pr-4">Qty</th>
                    <th className="py-2 pr-4">Harga Saat Trade</th>
                  </tr>
                </thead>
                <tbody>
                  {trades.map((t) => (
                    <tr
                      key={t._id || t.id}
                      className="border-b border-slate-800/60 last:border-0"
                    >
                      <td className="py-2 pr-4 text-[11px] text-gray-400">
                        {t.createdAt
                          ? new Date(t.createdAt).toLocaleString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "-"}
                      </td>
                      <td className="py-2 pr-4">{t.symbol}</td>
                      <td
                        className={`py-2 pr-4 font-semibold ${
                          t.side === "BUY"
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      >
                        {t.side}
                      </td>
                      <td className="py-2 pr-4">{t.quantity}</td>
                      <td className="py-2 pr-4">
                        {formatMoney(t.priceUSD || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}