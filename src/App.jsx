import React, { useEffect, useState } from "react";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Sidebar from "./components/Sidebar.jsx";
import TradeDemo from "./pages/TradeDemo.jsx";
import Compare from "./pages/Compare.jsx";

export default function App() {
  const [view, setView] = useState("login"); // login | register | dashboard
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");
  // dashboard | trade | compare
  const [activePage, setActivePage] = useState("dashboard");
  // untuk mobile sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // restore session
  useEffect(() => {
    const savedToken = localStorage.getItem("cf_token");
    const savedEmail = localStorage.getItem("cf_email");
    if (savedToken && savedEmail) {
      setToken(savedToken);
      setEmail(savedEmail);
      setView("dashboard");
    }
  }, []);

  const handleLoginSuccess = (t, e) => {
    setToken(t);
    setEmail(e);
    setView("dashboard");
  };

  const handleLogout = () => {
    setToken(null);
    setEmail("");
    setView("login");
    localStorage.removeItem("cf_token");
    localStorage.removeItem("cf_email");
    setActivePage("dashboard");
    setSidebarOpen(false);
  };

  // ============ MODE DASHBOARD (SUDAH LOGIN) ============
  if (view === "dashboard" && token) {
    const userName = email?.split("@")[0] || "";

    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row">
        {/* Top bar (MOBILE ONLY) */}
        <header className="lg:hidden fixed top-0 inset-x-0 h-14 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-blue-500/40">
              C
            </div>
            <div className="leading-tight">
              <p className="text-[11px] text-slate-400">CRYPTO</p>
              <p className="text-sm font-semibold tracking-wide">FEED</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-300 truncate max-w-[120px]">
              {userName}
            </span>
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800"
            >
              {/* icon hamburger sederhana */}
              <div className="space-y-1">
                <span className="block w-4 h-[2px] bg-slate-200" />
                <span className="block w-4 h-[2px] bg-slate-200" />
                <span className="block w-4 h-[2px] bg-slate-200" />
              </div>
            </button>
          </div>
        </header>

        {/* Overlay kalau sidebar dibuka (MOBILE) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800
            transform transition-transform duration-200
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0 lg:static lg:h-screen lg:overflow-y-auto lg:sticky lg:top-0
          `}
        >
          <Sidebar
            onLogout={handleLogout}
            activeView={activePage}
            onChangeView={(page) => {
              setActivePage(page);
              setSidebarOpen(false); 
            }}
          />
        </aside>

        {/* Konten utama */}
        <main
          className="
            flex-1 overflow-y-auto
            pt-14 lg:pt-0
            lg:ml-0
          "
        >
          {activePage === "dashboard" && (
            <Dashboard email={email} token={token} />
          )}
          {activePage === "trade" && <TradeDemo token={token} />}
          {activePage === "compare" && <Compare token={token} />}
        </main>
      </div>
    );
  }

  // ============ MODE AUTH (LOGIN / REGISTER) ============
  const isLogin = view === "login";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center text-white overflow-x-hidden">
      <div className="w-full max-w-4xl mx-4 lg:mx-auto rounded-3xl bg-black/60 border border-slate-800 shadow-2xl shadow-blue-900/40 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Left hero */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 px-10 py-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-wider">
              CRYPTO FEED
            </h1>
            <p className="mt-4 text-sm text-blue-100/90">
              Pantau harga kripto, baca berita terkini, dan coba trade demo
              dalam satu dashboard yang simpel.
            </p>
          </div>
          <div className="mt-10 text-xs text-blue-100/80">
            <p className="font-semibold mb-1">Kenapa Crypto Feed?</p>
            <ul className="space-y-1">
              <li>• Data harga real-time dari API publik</li>
              <li>• Ringkasan profit/loss portofolio (demo)</li>
              <li>• News feed kripto yang relevan</li>
            </ul>
          </div>
        </div>

        {/* Right form */}
        <div className="px-6 py-8 sm:px-8 lg:px-10 lg:py-10 bg-slate-950/85 w-full">
          {isLogin ? (
            <Login
              onLoginSuccess={handleLoginSuccess}
              switchToRegister={() => setView("register")}
            />
          ) : (
            <Register
              switchToLogin={(preFillEmail) => {
                if (preFillEmail) setEmail(preFillEmail);
                setView("login");
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}