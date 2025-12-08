const API_URL = import.meta.env.VITE_API_BASE_URL || "https://crypto-feed-backend.vercel.app/";

// LOGIN
export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok || data.ok === false) {
    throw new Error(data.message || "Login gagal");
  }
  return data; // { token, message, ... }
}

// REGISTER
export async function register({ email, password, username }) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, username }),
  });
  const data = await res.json();
  if (!res.ok || data.ok === false) {
    throw new Error(data.message || "Registrasi gagal");
  }
  return data;
}

// HARGA
export async function getPrices() {
  const res = await fetch(
    `${API_URL}/prices?coins=bitcoin,ethereum,solana`
  );
  if (!res.ok) throw new Error("Gagal mengambil data harga");
  return res.json();
}

// BERITA (semua coin, atau filter per coin kalau mau)
export async function getNews(token, coin) {
  const url = new URL(`${API_URL}/news`);

  if (coin) {
    // misal 'btc', 'eth', 'sol'
    url.searchParams.set("coin", coin.toLowerCase());
  }

  const res = await fetch(url.toString(), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const data = await res.json();

  if (!res.ok || data.ok === false) {
    throw new Error(data.message || "Gagal mengambil berita");
  }

  return data.articles || [];
}

// TRADE
export async function createTrade(token, payload) {
  const res = await fetch(`${API_URL}/trade`, {   // ⬅️ SINGULAR, sesuai backend
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok || data.ok === false) {
    throw new Error(data.message || "Gagal menyimpan trade");
  }

  // backend kamu balas: { ok: true, message: "Trade executed", trade: {...} }
  return data.trade;
}

// RIWAYAT TRADE
export async function getTradeHistory(token) {
  const res = await fetch(`${API_URL}/trade/history`, {  // ⬅️ juga /trade
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok || data.ok === false) {
    throw new Error(data.message || "Gagal mengambil riwayat trade");
  }

  // backend seharusnya kirim: { ok: true, trades: [...] }
  return data.trades || [];
}

// MARKET HISTORY (untuk chart Market Overview)
export async function getMarketHistory(range = "1D", coin = "bitcoin") {
  const url = new URL(`${API_URL}/market`);
  url.searchParams.set("range", range);
  url.searchParams.set("coin", coin);

  const res = await fetch(url.toString());
  const data = await res.json();

  if (!res.ok || data.ok === false) {
    throw new Error(data.message || "Gagal mengambil data historis market");
  }

  // points: [{ ts, price }]
  return data.points || [];
}


// COMPARE COINS
export async function compareCoinsApi(coinIds = ["bitcoin", "ethereum", "solana"]) {
  const params = new URLSearchParams({
    coins: coinIds.join(","),
  });

  const res = await fetch(`${API_URL}/compare?${params.toString()}`);
  const data = await res.json();

  if (!res.ok || data.ok === false) {
    throw new Error(data.message || "Gagal mengambil data perbandingan coin");
  }

  return data.coins || [];
}