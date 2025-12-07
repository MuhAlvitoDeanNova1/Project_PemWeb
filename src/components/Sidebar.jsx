import React from "react";
import {
  LayoutDashboard,
  BarChart3,
  Wallet,
  Settings,
  LogOut,
} from "lucide-react";

export default function Sidebar({ onLogout }) {
  return (
    <div className="h-full w-64 bg-slate-950 border-r border-slate-800 text-white flex flex-col justify-between px-5 py-6">
      <div>
        <div className="flex items-center mb-8">
          <div className="h-9 w-9 rounded-xl bg-blue-500 flex items-center justify-center mr-2 shadow-lg shadow-blue-500/40">
            <span className="font-extrabold text-lg">C</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-widest">CRYPTO</p>
            <p className="text-sm font-extrabold tracking-widest">FEED</p>
          </div>
        </div>

        <nav className="space-y-2 text-sm">
          <div className="flex items-center px-3 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow shadow-blue-500/40">
            <LayoutDashboard className="w-4 h-4 mr-3" />
            <span>Dashboard</span>
          </div>
          <button className="flex w-full items-center px-3 py-2 rounded-xl hover:bg-slate-800 transition">
            <BarChart3 className="w-4 h-4 mr-3" />
            <span>Trade (Demo)</span>
          </button>
          <button className="flex w-full items-center px-3 py-2 rounded-xl hover:bg-slate-800 transition">
            <Wallet className="w-4 h-4 mr-3" />
            <span>Wallet</span>
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