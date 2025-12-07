import React from "react";
import { TrendingUp } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  colorClass,
  percentChange,
}) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-md flex flex-col justify-between">
      <div className="flex items-start justify-between mb-2">
        <span className="text-[11px] font-medium text-gray-400">
          {title}
        </span>
        {Icon && <Icon className={`w-5 h-5 ${colorClass}`} />}
      </div>
      <div>
        <p className="text-xl font-semibold">{value}</p>
        {typeof percentChange === "number" && (
          <p
            className={`mt-1 text-[11px] flex items-center ${
              percentChange >= 0 ? "text-emerald-400" : "text-red-400"
            }`}
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            {percentChange.toFixed(2)}%
          </p>
        )}
      </div>
    </div>
  );
}