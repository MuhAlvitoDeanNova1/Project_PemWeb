import React from "react";
import {
  LayoutDashboard,
  BarChart3,
  BarChart2,
  Wallet,
  Settings,
  LogOut,
} from "lucide-react";
import appLogo from "../assets/crypto-feed-logo.png";

export default function Sidebar({ onLogout, activeView, onChangeView }) {
  return (
    <div className="h-full w-64 bg-slate-950 border-r border-slate-800 text-white flex flex-col justify-between px-5 py-6">
      <div>
        <div className="flex items-center mb-8">
          <img
            src={appLogo}
            alt="Crypto Feed"
            className="w-8 h-8 rounded-lg object-contain"
          />
          <div className="ml-3 leading-tight">
            <p className="text-sm font-extrabold tracking-widest">CRYPTO</p>
            <p className="text-sm font-extrabold tracking-widest">FEED</p>
          </div>
        </div>

        <nav className="space-y-2 text-sm">
          <button
            className={`flex w-full items-center px-3 py-2 rounded-xl transition ${
              activeView === "dashboard"
                ? "bg-blue-600 text-white font-semibold shadow shadow-blue-500/40"
                : "hover:bg-slate-800"
            }`}
            onClick={() => onChangeView("dashboard")}
          >
            <LayoutDashboard className="w-4 h-4 mr-3" />
            <span>Dashboard</span>
          </button>

          <button
            className={`flex w-full items-center px-3 py-2 rounded-xl transition ${
              activeView === "trade"
                ? "bg-emerald-600 text-white font-semibold shadow shadow-emerald-500/40"
                : "hover:bg-slate-800"
            }`}
            onClick={() => onChangeView("trade")}
          >
            <BarChart3 className="w-4 h-4 mr-3" />
            <span>Trade (Demo)</span>
          </button>
          <button
            className={`flex w-full items-center px-3 py-2 rounded-xl transition ${
              activeView === "compare"
                ? "bg-purple-600 text-white font-semibold shadow shadow-purple-500/40"
                : "hover:bg-slate-800"
            }`}
            onClick={() => onChangeView("compare")}
          >
            <BarChart2 className="w-4 h-4 mr-3" />
            <span>Compare</span>
          </button>
        </nav>
      </div>

      <div className="space-y-2 text-sm">
        <button className="flex w-full items-center px-3 py-2 rounded-xl hover:bg-slate-800 transition">
          <Settings className="w-4 h-4 mr-3" />
          <span>Settings</span>
        </button>
        <button
          onClick={onLogout}
          className="flex w-full items-center px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 transition font-semibold"
        >
          <LogOut className="w-4 h-4 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition
        ${active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
          : "text-slate-200 hover:bg-slate-800/80"
        }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}