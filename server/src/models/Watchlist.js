import mongoose from "mongoose";
const watchlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  symbols: [String]      // ["btc","eth","sol"]
});
export default mongoose.model("Watchlist", watchlistSchema);