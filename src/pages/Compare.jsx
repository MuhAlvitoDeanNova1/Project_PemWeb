// src/pages/Compare.jsx
import React, { useEffect, useState } from "react";
import { compareCoinsApi } from "../services/api";

const COIN_OPTIONS = [
  { id: "bitcoin", label: "Bitcoin (BTC)" },
  { id: "ethereum", label: "Ethereum (ETH)" },
  { id: "solana", label: "Solana (SOL)" },
];

const formatMoney = (v) =>
  typeof v === "number"
    ? `$${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : "-";

const formatPercent = (v) =>
  typeof v === "number"
    ? `${v.toFixed(2)}%`
    : "-";

function Compare() {
  const [selected, setSelected] = useState(["bitcoin", "ethereum", "solana"]);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggleCoin = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const loadData = async () => {
    if (selected.length === 0) {
      setCoins([]);
      return;
    }
    try {
      setLoading(true);
      setError("");
      const data = await compareCoinsApi(selected);
      setCoins(data);
    } catch (err) {
      setError(err.message || "Gagal mengambil data perbandingan");
    } finally {
      setLoading(false);
    }
  };

  // otomatis load saat pertama kali
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
        <h1 className="text-2xl lg:text-3xl font-extrabold text-blue-400 mb-2">
          Bandingkan Antar Coin
        </h1>
        <p className="text-sm text-gray-400 mb-4">
          Pilih beberapa koin lalu lihat perbandingan harga, perubahan
          persentase, volume, dan market cap dalam satu tabel.
        </p>

        {/* Pilihan coin */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6">
          <p className="text-sm font-semibold mb-2">Pilih coin yang akan dibandingkan:</p>
          <div className="flex flex-wrap gap-3 mb-4">
            {COIN_OPTIONS.map((c) => (
              <label
                key={c.id}
                className={`px-3 py-1 rounded-full border text-xs cursor-pointer transition
                  ${
                    selected.includes(c.id)
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-slate-600 text-gray-300 hover:border-slate-400"
                  }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selected.includes(c.id)}
                  onChange={() => toggleCoin(c.id)}
                />
                {c.label}
              </label>
            ))}
          </div>
          <button
            onClick={loadData}
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-sm font-semibold"
          >
            Bandingkan
          </button>
        </div>

        {/* Hasil perbandingan */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Hasil Perbandingan</h2>
            {loading && (
              <span className="text-xs text-gray-400">
                Mengambil data dari CoinGecko...
              </span>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-400 mb-2">{error}</p>
          )}

          {coins.length === 0 && !loading && !error && (
            <p className="text-sm text-gray-400">
              Belum ada data. Pilih minimal satu coin lalu klik{" "}
              <span className="font-semibold">Bandingkan</span>.
            </p>
          )}

          {coins.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-slate-800">
                    <th className="py-2 text-left">Coin</th>
                    <th className="py-2 text-right">Price</th>
                    <th className="py-2 text-right">24h Change</th>
                    <th className="py-2 text-right">7d Change</th>
                    <th className="py-2 text-right">Volume 24h</th>
                    <th className="py-2 text-right">Market Cap</th>
                  </tr>
                </thead>
                <tbody>
                  {coins.map((c) => (
                    <tr
                      key={c.id}
                      className="border-b border-slate-900 hover:bg-slate-900/60"
                    >
                      <td className="py-2 pr-4 flex items-center gap-2">
                        <img
                          src={c.image}
                          alt={c.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <div>
                          <div className="font-semibold">{c.symbol}</div>
                          <div className="text-xs text-gray-400">{c.name}</div>
                        </div>
                      </td>
                      <td className="py-2 text-right">
                        {formatMoney(c.currentPrice)}
                      </td>
                      <td
                        className={`py-2 text-right ${
                          c.change24h > 0
                            ? "text-emerald-400"
                            : c.change24h < 0
                            ? "text-red-400"
                            : "text-gray-300"
                        }`}
                      >
                        {formatPercent(c.change24h)}
                      </td>
                      <td
                        className={`py-2 text-right ${
                          c.change7d > 0
                            ? "text-emerald-400"
                            : c.change7d < 0
                            ? "text-red-400"
                            : "text-gray-300"
                        }`}
                      >
                        {formatPercent(c.change7d)}
                      </td>
                      <td className="py-2 text-right">
                        {formatMoney(c.volume24h)}
                      </td>
                      <td className="py-2 text-right">
                        {formatMoney(c.marketCap)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Compare;