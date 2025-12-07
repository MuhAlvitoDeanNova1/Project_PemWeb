import { Router } from "express";

const router = Router();

async function getSimplePrices(ids = "bitcoin,ethereum,solana") {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch prices");
  return res.json();
}

router.get("/", async (req, res) => {
  try {
    const coins = req.query.coins || "bitcoin,ethereum,solana";
    const data = await getSimplePrices(coins);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, message: "Failed to get prices" });
  }
});

export default router;