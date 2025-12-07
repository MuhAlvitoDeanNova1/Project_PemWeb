import React, { useState } from "react";
import { LogIn, Mail, Lock } from "lucide-react";
import InputField from "../components/InputField.jsx";
import { login } from "../services/api.js";

export default function Login({ onLoginSuccess, switchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setIsLoading(true);
    try {
      const data = await login(email, password);
      localStorage.setItem("cf_token", data.token);
      localStorage.setItem("cf_email", email);
      onLoginSuccess(data.token, email);
    } catch (err) {
      setAuthError(err.message || "Login gagal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <h2 className="text-2xl font-bold mb-1">Welcome Back 👋</h2>
      <p className="text-xs text-gray-400 mb-3">
        Masuk ke akun Crypto Feed Anda.
      </p>

      {authError && (
        <div className="mb-3 text-xs text-red-300 bg-red-900/40 border border-red-700 rounded-lg px-3 py-2">
          {authError}
        </div>
      )}

      <InputField
        id="login-email"
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@example.com"
        icon={Mail}
      />
      <InputField
        id="login-password"
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        icon={Lock}
      />

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full mt-2 flex items-center justify-center py-2.5 rounded-xl text-sm font-semibold transition shadow-lg ${
          isLoading
            ? "bg-slate-700 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/40"
        }`}
      >
        {isLoading ? (
          "Memproses..."
        ) : (
          <>
            <LogIn className="w-4 h-4 mr-2" />
            Login
          </>
        )}
      </button>

      <p className="text-[11px] text-gray-400 mt-3">
        Belum punya akun?{" "}
        <button
          type="button"
          onClick={switchToRegister}
          className="text-blue-400 hover:text-blue-300 font-semibold"
        >
          Daftar sekarang
        </button>
      </p>
    </form>
  );
}