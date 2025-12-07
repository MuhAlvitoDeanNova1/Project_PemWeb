import React, { useEffect, useState } from "react";
import { User, DollarSign, BarChart3 } from "lucide-react";
import StatCard from "../components/StatCard.jsx";
import { getPrices, getNews } from "../services/api.js";

export default function Dashboard({ email, token }) {
  const [prices, setPrices] = useState(null);
  const [pricesLoading, setPricesLoading] = useState(false);
  const [pricesError, setPricesError] = useState("");

  const [news, setNews] = useState([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      // HARGA
      try {
        setPricesLoading(true);
        const priceData = await getPrices();
        setPrices(priceData);
      } catch (err) {
        setPricesError(err.message || "Gagal mengambil harga");
      } finally {
        setPricesLoading(false);
      }

      // BERITA
      try {
        setNewsLoading(true);
        // kalau mau filter per koin, mis: getNews(token, "btc")
        const newsData = await getNews(token);
        setNews(newsData);
      } catch (err) {
        setNewsError(err.message || "Gagal mengambil berita");
      } finally {
        setNewsLoading(false);
      }
    };

    fetchAll();
  }, [token]);

  const formatPrice = (v) =>
    typeof v === "number" ? `$${v.toLocaleString()}` : "-";

  const displayName = email ? email.split("@")[0] : "User";

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* container dibatasi supaya layout tidak ketarik oleh news */}
      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-6">
        {/* header */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-blue-400">
              Dashboard Utama
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              Selamat datang,{" "}
              <span className="font-semibold">{displayName}</span>
            </p>
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <User className="w-4 h-4 mr-2" />
            {email}
          </div>
        </header>

        {/* stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="BTC Price"
            value={formatPrice(prices?.bitcoin?.usd)}
            icon={DollarSign}
            colorClass="text-orange-400"
            percentChange={prices?.bitcoin?.usd_24h_change}
          />
          <StatCard
            title="ETH Price"
            value={formatPrice(prices?.ethereum?.usd)}
            icon={DollarSign}
            colorClass="text-blue-400"
            percentChange={prices?.ethereum?.usd_24h_change}
          />
          <StatCard
            title="SOL Price"
            value={formatPrice(prices?.solana?.usd)}
            icon={DollarSign}
            colorClass="text-purple-400"
            percentChange={prices?.solana?.usd_24h_change}
          />
          <StatCard
            title="Open Trades (Demo)"
            value="8"
            icon={BarChart3}
            colorClass="text-emerald-400"
            percentChange={-1.2}
          />
        </section>

        {/* market overview */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 mb-10 shadow-lg">
          <h2 className="text-lg font-semibold mb-3">
            Market Overview{" "}
            <span className="text-sm text-gray-400">(BTC/USDT)</span>
          </h2>
          <div className="h-64 bg-slate-800/80 rounded-xl flex items-center justify-center text-sm text-gray-300">
            {pricesLoading && "Mengambil data harga..."}
            {pricesError && !pricesLoading && (
              <span className="text-red-400">{pricesError}</span>
            )}
            {!pricesLoading && !pricesError && !prices && (
              <>Belum ada data harga.</>
            )}
            {!pricesLoading && !pricesError && prices && (
              <>[Placeholder grafik candlestick BTC]</>
            )}
          </div>
        </section>

        {/* news */}
        <section className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Crypto News Feed</h2>

          {newsLoading && (
            <p className="text-sm text-gray-400 mb-2">
              Mengambil berita terbaru...
            </p>
          )}
          {newsError && (
            <p className="text-sm text-red-400 mb-2">{newsError}</p>
          )}

          <div className="w-full overflow-x-auto pb-3 scrollbar-hide">
            <div className="flex flex-nowrap gap-4">
              {news.length === 0 && !newsLoading && !newsError && (
                <p className="text-sm text-gray-400">
                  Belum ada berita atau API tidak mengembalikan data.
                </p>
              )}

              {news.map((item, idx) => (
                <a
                  key={item.id || idx}
                  href={item.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-80 flex-shrink-0 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-md overflow-hidden flex flex-col hover:border-blue-500/70 hover:shadow-blue-500/30 transition"
                >
                  {/* header / gambar */}
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-32 w-full object-cover"
                    />
                  ) : (
                    <div className="h-32 w-full bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center text-xs font-semibold text-blue-50 px-3 text-center">
                      CRYPTO NEWS
                    </div>
                  )}

                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-sm font-semibold text-blue-200 mb-2 line-clamp-3">
                      {item.title}
                    </h3>

                    {item.summary && (
                      <p className="text-[11px] text-gray-300 mb-2 line-clamp-3">
                        {item.summary}
                      </p>
                    )}

                    <p className="text-[11px] text-gray-400 mb-2">
                      {item.publishedAt
                        ? new Date(item.publishedAt).toLocaleString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </p>

                    <span className="mt-auto text-[11px] text-gray-500">
                      Sumber: {item.source || "Unknown"}
                    </span>
                  </div>
                </a>
              ))}
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
}