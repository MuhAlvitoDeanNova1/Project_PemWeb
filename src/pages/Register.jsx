import React, { useState } from "react";
import { UserPlus, User, Mail, Lock } from "lucide-react";
import InputField from "../components/InputField.jsx";
import { register } from "../services/api.js";

export default function Register({ switchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [authError, setAuthError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    if (password !== confirm) {
      setAuthError("Password dan konfirmasi tidak sama.");
      return;
    }
    setIsLoading(true);
    try {
      const data = await register({ email, password, username });
      alert(
        data.message ||
          "Registrasi berhasil! Silakan cek email untuk verifikasi, lalu login."
      );
      switchToLogin(email);
    } catch (err) {
      setAuthError(err.message || "Registrasi gagal");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <h2 className="text-2xl font-bold mb-1">Create Account ✨</h2>
      <p className="text-xs text-gray-400 mb-3">
        Daftar dan mulai pantau pasar kripto.
      </p>

      {authError && (
        <div className="mb-3 text-xs text-red-300 bg-red-900/40 border border-red-700 rounded-lg px-3 py-2">
          {authError}
        </div>
      )}

      <InputField
        id="reg-username"
        type="text"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Nama panggilan Anda"
        icon={User}
      />
      <InputField
        id="reg-email"
        type="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@example.com"
        icon={Mail}
      />
      <InputField
        id="reg-password"
        type="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        icon={Lock}
      />
      <InputField
        id="reg-confirm"
        type="password"
        label="Konfirmasi Password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Ulangi password"
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
            <UserPlus className="w-4 h-4 mr-2" />
            Daftar
          </>
        )}
      </button>

      <p className="text-[11px] text-gray-400 mt-3">
        Sudah punya akun?{" "}
        <button
          type="button"
          onClick={() => switchToLogin()}
          className="text-blue-400 hover:text-blue-300 font-semibold"
        >
          Login
        </button>
      </p>
    </form>
  );
}