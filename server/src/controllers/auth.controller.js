import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { mailer } from "../config/mailer.js";

const API_URL = process.env.API_URL || "http://localhost:4000";

// REGISTER
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cek email sudah terdaftar atau belum
    const exist = await User.findOne({ email });
    if (exist) {
      return res
        .status(409)
        .json({ ok: false, message: "Email already registered" });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Buat user baru, isVerified default: false
    const user = await User.create({
      email,
      password: passwordHash,
    });

    // Buat token verifikasi (berlaku 1 hari)
    const token = jwt.sign(
      { uid: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Link verifikasi
    const verifyLink = `${API_URL}/auth/verify/${token}`;

    // Kirim email verifikasi
    await mailer.sendMail({
      from: `"CryptoFeed" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verifikasi Akun CryptoFeed",
      html: `
        <p><b>Selamat datang di CryptoFeed!</b></p>
        <p>Klik link berikut untuk memverifikasi akun Anda:</p>
        <a href="${verifyLink}">${verifyLink}</a>
        <p>Terima kasih telah mendaftar.</p>
      `,
    });

    res.json({
      ok: true,
      message: "Registrasi berhasil, cek email untuk verifikasi akun.",
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};

// VERIFIKASI EMAIL
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Update isVerified di MongoDB
    await User.findByIdAndUpdate(decoded.uid, { isVerified: true });

    // Bisa balas JSON sederhana
    return res.json({
      ok: true,
      message: "Akun berhasil diverifikasi. Silakan login.",
    });

    // return res.redirect("http://localhost:5173/login");
  } catch (err) {
    console.error("Verify email error:", err);
    return res
      .status(400)
      .json({ ok: false, message: "Invalid or expired token" });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ ok: false, message: "Invalid email or password" });
    }

    // Cek password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res
        .status(401)
        .json({ ok: false, message: "Invalid email or password" });
    }

    // Cek sudah verifikasi atau belum
    if (!user.isVerified) {
      return res
        .status(403)
        .json({ ok: false, message: "Email not verified" });
    }

    // Buat token login (7 hari)
    const token = jwt.sign(
      { uid: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      ok: true,
      token,
      user: {
        email: user.email,
        balanceUSD: user.balanceUSD,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};

// GET PROFILE /auth/me
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ ok: false, message: "User not found" });
    }

    res.json({
      ok: true,
      user,
    });
  } catch (err) {
    console.error("Me error:", err);
    res.status(500).json({ ok: false, message: "Server error" });
  }
};