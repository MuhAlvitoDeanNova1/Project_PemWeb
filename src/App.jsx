import React, { useEffect, useState } from "react";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Sidebar from "./components/Sidebar.jsx";
import TradeDemo from "./pages/TradeDemo.jsx";

export default function App() {
  const [view, setView] = useState("login"); // login | register | dashboard
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState("");
  const [activePage, setActivePage] = useState("dashboard"); // dashboard | trade

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
  };

  // DASHBOARD MODE
  if (view === "dashboard" && token) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex">
        <aside className="w-64 h-screen sticky top-0">
          <Sidebar 
            onLogout={handleLogout}
            activeView={activePage}
            onChangeView={setActivePage}
          />
        </aside>

        <main className="flex-1 overflow-y-auto">
          {activePage === "dashboard" && (
            <Dashboard email={email} token={token} />
          )}
          {activePage === "trade" && <TradeDemo token={token} />}
        </main>
      </div>
    );
  }

  // AUTH MODE (LOGIN / REGISTER)
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
        <div className="px-8 py-8 lg:px-10 lg:py-10 bg-slate-950/85">
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