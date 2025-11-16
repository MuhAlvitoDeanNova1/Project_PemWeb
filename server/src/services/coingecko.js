import axios from "axios";

const api = axios.create({
  baseURL: "https://api.coingecko.com/api/v3",
  timeout: 10000,
});

export async function getTopMarkets(vsCurrency = "usd", perPage = 10) {
  const { data } = await api.get("/coins/markets", {
    params: {
      vs_currency: vsCurrency,
      order: "market_cap_desc",
      per_page: perPage,
      page: 1,
      price_change_percentage: "1h,24h,7d",
    },
  });
  return data;
}

export async function getCoinDetail(id, vsCurrency = "usd") {
  const { data } = await api.get(`/coins/${id}`, {
    params: {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false,
      sparkline: false,
    },
  });
  return data;
}

export async function getCoinMarketChart(id, days = 1, vsCurrency = "usd") {
  const { data } = await api.get(`/coins/${id}/market_chart`, {
    params: {
      vs_currency: vsCurrency,
      days,
    },
  });
  return data;
}

export async function getSimplePrice(id, vsCurrency = "usd") {
  const { data } = await api.get("/simple/price", {
    params: {
      ids: id,
      vs_currencies: vsCurrency,
    },
  });
  const price = data[id]?.[vsCurrency];
  if (!price) throw new Error(`No price for ${id}`);
  return price;
}

// ambil beberapa coin sekaligus (markets)
export async function getMultipleMarkets(symbolIds, vsCurrency = "usd") {
  // symbolIds: array id coingecko, misal ["bitcoin","ethereum","solana"]
  const { data } = await api.get("/coins/markets", {
    params: {
      vs_currency: vsCurrency,
      ids: symbolIds.join(","),     // "bitcoin,ethereum,solana"
      order: "market_cap_desc",
      per_page: symbolIds.length,
      page: 1,
      price_change_percentage: "1h,24h,7d",
    },
  });
  return data;
}