const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

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

  // backend sekarang mengirim: { ok, total, articles: [...] }
  return data.articles || [];
}