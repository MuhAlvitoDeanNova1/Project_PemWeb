import { fetchNews } from "../services/cryptopanic.js";

// GET /news
// contoh: /news?symbol=btc&filter=hot
export const getNews = async (req, res) => {
  try {
    const { symbol, filter, page } = req.query;

    // normalisasi: btc -> BTC
    const currencies = symbol ? symbol.toUpperCase() : undefined;

    const data = await fetchNews({
      currencies,
      filter: filter || "rising",
      page,
    });

    // kita bisa sederhanakan data yang dikirim ke frontend
    const items = (data.results || []).map((item) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      source: item.source?.title,
      published_at: item.published_at,
      currencies: item.currencies?.map((c) => c.code), // ["BTC","ETH"]
      kind: item.kind, // news/media
      votes: item.votes,
    }));

    res.json({
      ok: true,
      count: items.length,
      next: data.next, // kalau mau paginasi
      results: items,
    });
  } catch (err) {
    console.error("Error fetch news:", err.message);
    res.status(500).json({
      ok: false,
      message: "Failed to fetch news",
    });
  }
};

// GET /news/:symbol (misal: /news/btc)
export const getNewsBySymbol = async (req, res) => {
  try {
    const { symbol } = req.params;

    const data = await fetchNews({
      currencies: symbol.toUpperCase(),
      filter: "rising",
    });

    const items = (data.results || []).map((item) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      source: item.source?.title,
      published_at: item.published_at,
      currencies: item.currencies?.map((c) => c.code),
      kind: item.kind,
      votes: item.votes,
    }));

    res.json({
      ok: true,
      count: items.length,
      results: items,
    });
  } catch (err) {
    console.error("Error fetch news by symbol:", err.message);
    res.status(500).json({
      ok: false,
      message: "Failed to fetch coin news",
    });
  }
};