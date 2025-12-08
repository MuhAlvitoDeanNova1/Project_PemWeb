import axios from "axios";

const NEWSDATA_BASE_URL = "https://newsdata.io/api/1/crypto";
const NEWSDATA_API_KEY = process.env.NEWSDATA_API_KEY;

// CACHE GLOBAL (di memory server)
let newsCacheAll = null;      // untuk /news tanpa filter
let newsCacheByCoin = {};     // untuk /news?coin=btc   atau /news/btc
let lastFetchAll = 0;
let lastFetchByCoin = {};     // { BTC: timestamp, ETH: timestamp, ... }

const CACHE_TIME = 10 * 60 * 1000; // 10 menit

// Helper untuk panggil API NewsData dan mapping
async function fetchCryptoNews({ coin }) {
  const url = new URL(NEWSDATA_BASE_URL);

  url.searchParams.set("apikey", NEWSDATA_API_KEY);
  url.searchParams.set("language", "en");

  if (coin) {
    url.searchParams.set("coin", coin.toLowerCase());
  }

  const { data } = await axios.get(url.toString());

  const items = data?.results || data?.articles || [];

  const mapped = items.map((item) => ({
    id: item.article_id || item.link || item.title,
    title: item.title,
    summary: item.description || item.content || "",
    publishedAt: item.pubDate || item.published_at || item.date,
    source: item.source_id || item.source || item.source_id,
    url: item.link || item.url,
    imageUrl: item.image_url || item.image || null,
  }));

  return mapped;
}

// GET /news  atau /news?coin=btc
export const getNews = async (req, res) => {
  const coin = req.query.coin ? req.query.coin.toUpperCase() : null;
  const now = Date.now();

  try {
    // 💾 CASE 1: TANPA FILTER COIN → pakai cache global
    if (!coin) {
      if (newsCacheAll && now - lastFetchAll < CACHE_TIME) {
        return res.json({
          ok: true,
          cached: true,
          total: newsCacheAll.length,
          articles: newsCacheAll,
        });
      }

      const articles = await fetchCryptoNews({ coin: null });
      newsCacheAll = articles;
      lastFetchAll = now;

      return res.json({
        ok: true,
        cached: false,
        total: articles.length,
        articles,
      });
    }

    // 💾 CASE 2: DENGAN FILTER COIN → pakai cache per coin
    if (!newsCacheByCoin[coin] || now - lastFetchByCoin[coin] > CACHE_TIME) {
      const articles = await fetchCryptoNews({ coin });
      newsCacheByCoin[coin] = articles;
      lastFetchByCoin[coin] = now;
    }

    const cachedArticles = newsCacheByCoin[coin] || [];

    return res.json({
      ok: true,
      cached: true,
      coin: coin.toLowerCase(),
      total: cachedArticles.length,
      articles: cachedArticles,
    });
  } catch (err) {
    console.error("Error getNews:", err.response?.data || err.message);

    // fallback kalau API error tapi cache masih ada
    if (!coin && newsCacheAll) {
      return res.json({
        ok: true,
        cached: "fallback",
        total: newsCacheAll.length,
        articles: newsCacheAll,
      });
    }
    if (coin && newsCacheByCoin[coin]) {
      const cachedArticles = newsCacheByCoin[coin];
      return res.json({
        ok: true,
        cached: "fallback",
        coin: coin.toLowerCase(),
        total: cachedArticles.length,
        articles: cachedArticles,
      });
    }

    return res.status(500).json({
      ok: false,
      message: "Tidak dapat memuat berita saat ini",
    });
  }
};

// GET /news/btc  /news/eth  /news/sol
export const getNewsBySymbol = async (req, res) => {
  const symbol = req.params.symbol?.toUpperCase();
  if (!symbol) {
    return res.status(400).json({
      ok: false,
      message: "Symbol wajib diisi, contoh: /news/btc",
    });
  }

  // Reuse logika sama dengan getNews?coin=...
  req.query.coin = symbol;
  return getNews(req, res);
};