import axios from "axios";

const client = axios.create({
  baseURL: "https://cryptopanic.com/api/v1",
  timeout: 10000,
});

// news umum atau per coin
export async function fetchNews({ currencies, kind = "news", filter = "rising", page } = {}) {
  const params = {
    auth_token: process.env.CRYPTOPANIC_API_KEY,
    public: true,
    kind,        // news | media
    filter,      // rising | hot | bullish | bearish | important | saved | lol
  };

  if (currencies) params.currencies = currencies; // contoh: "BTC,ETH"
  if (page) params.page = page;

  const { data } = await client.get("/posts/", { params });
  return data; // data.results berisi list berita
}
