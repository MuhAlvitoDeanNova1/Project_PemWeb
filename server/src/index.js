import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

// routes
import authRoutes from "./routes/auth.routes.js";
import pricesRoutes from "./routes/prices.routes.js";
import newsRoutes from "./routes/news.routes.js";
import tradeRoutes from "./routes/trade.routes.js";
import overviewRoutes from "./routes/overview.routes.js";
import compareRoutes from "./routes/compare.routes.js";
import marketRoutes from "./routes/market.routes.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://crypto-feed-backend.vercel.app/", // ganti dengan URL vercel kamu
    ],
    credentials: true,
    allowedHeaders: ["Authorization", "Content-Type"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());

// route testing sederhana
app.get("/health", (req, res) => {
  res.json({ ok: true, message: "API is running" });
});

// gunakan routes
app.use("/auth", authRoutes);
app.use("/prices", pricesRoutes);
app.use("/news", newsRoutes);
app.use("/trade", tradeRoutes);
app.use("/overview", overviewRoutes);
app.use("/compare", compareRoutes);
app.use("/market", marketRoutes);

const PORT = process.env.PORT || 4000;

connectDB(process.env.MONGODB_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});