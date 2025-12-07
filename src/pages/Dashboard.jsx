import React, { useEffect, useState, useMemo } from "react";
import { DollarSign, Lock, User, ArrowRight } from "lucide-react";
import {
  getPrices,
  getNews,
  getTradeHistory,
  getMarketHistory,
} from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import btcLogo from "../assets/btc.svg";
import ethLogo from "../assets/eth.png";
import solLogo from "../assets/sol.png";

const INITIAL_CASH = 10000;

const COIN_META = {
  bitcoin: {
    id: "bitcoin",
    symbol: "BTC",
    label: "Bitcoin",
    colorClass: "text-orange-400",
  },
  ethereum: {
    id: "ethereum",
    symbol: "ETH",
    label: "Ethereum",
    colorClass: "text-blue-400",
  },
  solana: {
    id: "solana",
    symbol: "SOL",
    label: "Solana",
    colorClass: "text-purple-400",
  },
};

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  colorClass,
  onClick,
  active,
  iconImg,
}) => {
  const baseClasses =
    "bg-slate-900/80 border rounded-2xl px-4 py-3 flex flex-col justify-between transition cursor-pointer";
  const borderClass = active
    ? "border-emerald-500 ring-1 ring-emerald-500"
    : "border-slate-800 hover:border-slate-600";
  return (
    <div className={`${baseClasses} ${borderClass}`} onClick={onClick}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-gray-400">{title}</p>
        {iconImg ? (
          <img
            src={iconImg}
            alt={title}
            className="w-5 h-5 object-contain"
          />
        ) : Icon ? (
          <Icon className={`w-4 h-4 ${colorClass}`} />
        ) : null}
      </div>
      <p className="text-xl font-semibold">{value}</p>
      {subtitle && <p className="text-[11px] text-gray-400 mt-1">{subtitle}</p>}
    </div>
  );
};

const formatMoney = (v) =>
  typeof v === "number"
    ? `$${v.toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    : "-";

const Dashboard = ({ userName, token }) => {
  const [prices, setPrices] = useState(null);
  const [pricesLoading, setPricesLoading] = useState(false);
  const [pricesError, setPricesError] = useState("");

  const [news, setNews] = useState([]);
  const [newsError, setNewsError] = useState("");
  const [newsLoading, setNewsLoading] = useState(false);

  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewError, setOverviewError] = useState("");

  const [equityRange, setEquityRange] = useState("1M"); // 1D, 1W, 1M, ALL

  // MARKET OVERVIEW STATE
  const [marketRange, setMarketRange] = useState("1M"); // 1D, 1W, 1M
  const [selectedCoin, setSelectedCoin] = useState("bitcoin"); // bitcoin | ethereum | solana
  const [marketData, setMarketData] = useState([]);
  const [marketDomain, setMarketDomain] = useState([0, 0]);
  const [marketLoading, setMarketLoading] = useState(false);
  const [marketError, setMarketError] = useState("");

  const selectedMeta = COIN_META[selectedCoin];

  // ================= PRICES =================
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        setPricesLoading(true);
        setPricesError("");
        const data = await getPrices();
        setPrices(data);
      } catch (err) {
        setPricesError(err.message || "Gagal mengambil data harga");
      } finally {
        setPricesLoading(false);
      }
    };
    fetchPrices();
  }, []);

  // ================= NEWS =================
  useEffect(() => {
    const fetchNews = async () => {
      try {
        setNewsLoading(true);
        setNewsError("");
        const data = await getNews(token);
        setNews(data.slice(0, 6));
      } catch (err) {
        setNewsError(err.message || "Gagal mengambil berita");
      } finally {
        setNewsLoading(false);
      }
    };
    fetchNews();
  }, [token]);

  // ================= OVERVIEW (TRADES) =================
  useEffect(() => {
    if (!token) return;

    const computeOverviewFromTrades = (trades) => {
      if (!trades || trades.length === 0) {
        return {
          cashBalance: INITIAL_CASH,
          portfolioValue: 0,
          totalEquity: INITIAL_CASH,
          totalPnl: 0,
          history: [],
        };
      }

      let cash = INITIAL_CASH;
      const holdings = {};
      const lastPrice = {};
      const history = [];

      const sorted = [...trades].sort(
        (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
      );

      sorted.forEach((t, idx) => {
        const tradePrice = t.priceUSD || 0;
        const symbol = t.symbol;
        const value = tradePrice * t.quantity;

        if (!holdings[symbol]) holdings[symbol] = 0;

        if (t.side === "BUY") {
          cash -= value;
          holdings[symbol] += t.quantity;
        } else {
          cash += value;
          holdings[symbol] -= t.quantity;
        }

        lastPrice[symbol] = tradePrice || lastPrice[symbol] || 0;

        let portfolioVal = 0;
        Object.keys(holdings).forEach((sym) => {
          const qty = holdings[sym];
          const p = lastPrice[sym] || 0;
          portfolioVal += qty * p;
        });

        const equity = cash + portfolioVal;
        const dt = t.createdAt ? new Date(t.createdAt) : new Date();
        const ts = dt.getTime();

        history.push({
          idx: idx + 1,
          equity: Number(equity.toFixed(2)),
          ts,
          labelDate: dt.toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
          }),
          labelTime: dt.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      });

      let portfolioValNow = 0;
      Object.keys(holdings).forEach((sym) => {
        const qty = holdings[sym];
        const p = lastPrice[sym] || 0;
        portfolioValNow += qty * p;
      });

      const totalEquityNow = cash + portfolioValNow;
      const totalPnl = totalEquityNow - INITIAL_CASH;

      return {
        cashBalance: cash,
        portfolioValue: portfolioValNow,
        totalEquity: totalEquityNow,
        totalPnl,
        history,
      };
    };

    const fetchOverview = async () => {
      try {
        setOverviewLoading(true);
        setOverviewError("");
        const trades = await getTradeHistory(token);
        const summary = computeOverviewFromTrades(trades);
        setOverview(summary);
      } catch (err) {
        setOverviewError(err.message || "Gagal memuat data demo portfolio");
      } finally {
        setOverviewLoading(false);
      }
    };

    fetchOverview();
  }, [token]);

  // ================= FILTERED EQUITY DATA (RANGE) =================
  const filteredEquityData = useMemo(() => {
    if (!overview?.history || overview.history.length === 0) return [];
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (equityRange === "ALL") return overview.history;

    let diff;
    if (equityRange === "1D") diff = oneDay;
    else if (equityRange === "1W") diff = 7 * oneDay;
    else diff = 30 * oneDay; // 1M

    return overview.history.filter((h) => now - h.ts <= diff);
  }, [overview, equityRange]);


  const equityDomain = useMemo(() => {
  if (!filteredEquityData || filteredEquityData.length === 0) {
    return ["auto", "auto"];
  }

  const values = filteredEquityData.map((p) => p.equity);
  let min = Math.min(...values);
  let max = Math.max(...values);

  let range = max - min;

  const minRange = (max || 1) * 0.02;
  if (range < minRange) {
    range = minRange;
  }

  const padding = range * 0.1;

  min = min - padding;
  max = max + padding;

  return [min, max];
}, [filteredEquityData]);

  // ================= MARKET OVERVIEW DARI API HISTORIS =================
  useEffect(() => {
    const fetchMarket = async () => {
      try {
        setMarketLoading(true);
        setMarketError("");
        setMarketData([]);

        const points = await getMarketHistory(marketRange, selectedCoin);
        if (!points || points.length === 0) {
          setMarketData([]);
          return;
        }

        let minPrice = points[0].price;
        let maxPrice = points[0].price;

        points.forEach((p) => {
          if (p.price < minPrice) minPrice = p.price;
          if (p.price > maxPrice) maxPrice = p.price;
        });

        const currentPriceMap = {
          bitcoin: prices?.bitcoin?.usd,
          ethereum: prices?.ethereum?.usd,
          solana: prices?.solana?.usd,
        };

        const base = currentPriceMap[selectedCoin] || maxPrice || 1;
        let range = maxPrice - minPrice;
        const minRange = base * 0.01; // minimal range 1% dari harga sekarang

        if (range < minRange) range = minRange;

        const padding = range * 0.1; // padding 10%
        const minY = Math.max(0, minPrice - padding);
        const maxY = maxPrice + padding;

        const formatted = points.map((p) => {
          const d = new Date(p.ts);
          const label =
            marketRange === "1D"
              ? d.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : d.toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                });
          return {
            time: label,
            price: p.price,
          };
        });

        setMarketData(formatted);
        setMarketDomain([minY, maxY]);
      } catch (err) {
        console.error("Error fetch market history:", err);
        setMarketError(
          err.message || "Gagal memuat data market historis dari API"
        );
        setMarketData([]);
      } finally {
        setMarketLoading(false);
      }
    };

    fetchMarket();
  }, [marketRange, selectedCoin, prices]);

  const formatPrice = (val) =>
    typeof val === "number" ? `$${val.toLocaleString()}` : "-";

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
        {/* HEADER */}
        <header className="flex justify-between items-center mb-7">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-blue-400 mb-1">
              Dashboard Utama
            </h1>
            <p className="text-sm text-gray-400">
              Selamat datang, <span className="font-semibold">{userName}</span>
            </p>
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <User className="w-4 h-4 mr-2 text-gray-400" />
            {userName}
          </div>
        </header>

        {/* PRICE STAT CARDS (CLICKABLE) */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="BTC Price"
            value={formatPrice(prices?.bitcoin?.usd)}
            subtitle={
              pricesLoading
                ? "Memuat..."
                : pricesError
                ? pricesError
                : "Klik untuk lihat overview BTC"
            }
            iconImg={btcLogo}
            onClick={() => setSelectedCoin("bitcoin")}
            active={selectedCoin === "bitcoin"}
          />
          <StatCard
            title="ETH Price"
            value={formatPrice(prices?.ethereum?.usd)}
            subtitle="Klik untuk lihat overview ETH"
            iconImg={ethLogo}
            onClick={() => setSelectedCoin("ethereum")}
            active={selectedCoin === "ethereum"}
          />
          <StatCard
            title="SOL Price"
            value={formatPrice(prices?.solana?.usd)}
            subtitle="Klik untuk lihat overview SOL"
            iconImg={solLogo}
            onClick={() => setSelectedCoin("solana")}
            active={selectedCoin === "solana"}
          />
          <StatCard
            title="Open Trades (Demo)"
            value={overview?.history?.length || 0}
            subtitle="Total transaksi demo yang pernah dibuat"
            icon={Lock}
            colorClass="text-emerald-400"
          />
        </section>

        {/* MARKET OVERVIEW CHART */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-semibold">
                Market Overview ({selectedMeta.symbol}/USDT)
              </h2>
              <p className="text-xs text-gray-400">
                Data historis dari API publik (CoinGecko) untuk{" "}
                {selectedMeta.label}.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setMarketRange("1D")}
                className={`px-2 py-1 rounded-full border ${
                  marketRange === "1D"
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "border-slate-700 text-gray-300"
                }`}
              >
                1D
              </button>
              <button
                onClick={() => setMarketRange("1W")}
                className={`px-2 py-1 rounded-full border ${
                  marketRange === "1W"
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "border-slate-700 text-gray-300"
                }`}
              >
                1W
              </button>
              <button
                onClick={() => setMarketRange("1M")}
                className={`px-2 py-1 rounded-full border ${
                  marketRange === "1M"
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "border-slate-700 text-gray-300"
                }`}
              >
                1M
              </button>
            </div>
          </div>

          <div className="h-64 bg-slate-950 rounded-xl border border-slate-800 px-2 py-2">
            {marketLoading && (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                Mengambil data historis harga {selectedMeta.symbol}...
              </div>
            )}

            {!marketLoading && marketError && (
              <div className="w-full h-full flex items-center justify-center text-sm text-red-400">
                {marketError}
              </div>
            )}

            {!marketLoading && !marketError && marketData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                  />
                  <YAxis
                    domain={marketDomain}
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    tickFormatter={(v) =>
                      v.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#020617",
                      borderRadius: "0.5rem",
                      border: "1px solid #1f2937",
                      fontSize: 12,
                    }}
                    formatter={(value) => [formatMoney(value), "Price"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#22c55e"
                    fill="#22c55e33"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {!marketLoading && !marketError && marketData.length === 0 && (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">
                Tidak ada data historis yang bisa ditampilkan.
              </div>
            )}
          </div>
        </section>

        {/* DEMO PORTFOLIO SNAPSHOT + EQUITY CHART */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-1">
              Demo Portfolio Snapshot
            </h2>

            {overviewLoading && (
              <p className="text-sm text-gray-400">Menghitung portfolio...</p>
            )}
            {overviewError && (
              <p className="text-sm text-red-400">{overviewError}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <StatCard
                title="Demo Cash Balance"
                value={formatMoney(overview?.cashBalance ?? INITIAL_CASH)}
              />
              <StatCard
                title="Portfolio Value"
                value={formatMoney(overview?.portfolioValue ?? 0)}
              />
              <StatCard
                title="Total Equity"
                value={formatMoney(overview?.totalEquity ?? INITIAL_CASH)}
                subtitle="Cash + nilai aset demo"
              />
              <StatCard
                title="Total P/L (vs saldo awal)"
                value={formatMoney(overview?.totalPnl ?? 0)}
              />
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold">Demo Equity History</h3>
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setEquityRange("1D")}
                  className={`px-2 py-1 rounded-full border ${
                    equityRange === "1D"
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-slate-700 text-gray-300"
                  }`}
                >
                  1D
                </button>
                <button
                  onClick={() => setEquityRange("1W")}
                  className={`px-2 py-1 rounded-full border ${
                    equityRange === "1W"
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-slate-700 text-gray-300"
                  }`}
                >
                  1W
                </button>
                <button
                  onClick={() => setEquityRange("1M")}
                  className={`px-2 py-1 rounded-full border ${
                    equityRange === "1M"
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-slate-700 text-gray-300"
                  }`}
                >
                  1M
                </button>
                <button
                  onClick={() => setEquityRange("ALL")}
                  className={`px-2 py-1 rounded-full border ${
                    equityRange === "ALL"
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : "border-slate-700 text-gray-300"
                  }`}
                >
                  ALL
                </button>
              </div>
            </div>
            <div className="h-56">
              {filteredEquityData && filteredEquityData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredEquityData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                    <XAxis
                      dataKey={equityRange === "1D" ? "labelTime" : "labelDate"}
                      tick={{ fontSize: 10, fill: "#9ca3af" }}
                    />
                    <YAxis
                      domain={equityDomain}
                      tick={{ fontSize: 10, fill: "#9ca3af" }}
                      tickFormatter={(v) =>
                        v.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#020617",
                        borderRadius: "0.5rem",
                        border: "1px solid #1f2937",
                        fontSize: 12,
                      }}
                      formatter={(value) => [
                        formatMoney(value),
                        "Total Equity",
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="equity"
                      stroke="#22c55e"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                  Belum ada transaksi demo. Coba buat transaksi di menu Trade
                  (Demo).
                </div>
              )}
            </div>
          </div>
        </section>

        {/* NEWS SECTION */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-3">Crypto News Feed</h2>

          {newsLoading && (
            <p className="text-sm text-gray-400 mb-2">Memuat berita...</p>
          )}
          {newsError && (
            <p className="text-sm text-red-400 mb-2">{newsError}</p>
          )}

          <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex space-x-6 min-w-max">
              {news.map((item) => (
                <div key={item.id || item.url} className="w-80 flex-shrink-0">
                  <article className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden h-full flex flex-col">
                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-[11px] text-gray-400 mb-1">
                        {item.source || "Crypto news"}
                      </p>
                      <h3 className="text-sm font-semibold text-blue-300 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-3 mb-3">
                        {item.description || ""}
                      </p>
                      {item.publishedAt && (
                        <p className="text-[11px] text-gray-500 mb-3">
                          {new Date(item.publishedAt).toLocaleString(
                            "id-ID",
                            {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      )}
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-auto text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                        >
                          Read more
                          <ArrowRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </article>
                </div>
              ))}
              {news.length === 0 && !newsLoading && !newsError && (
                <p className="text-sm text-gray-400">
                  Belum ada berita yang ditampilkan.
                </p>
              )}
            </div>
          </div>

          <style jsx="true">{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;