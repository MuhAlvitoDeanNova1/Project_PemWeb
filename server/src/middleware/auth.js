import jwt from "jsonwebtoken";

export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization || "";

  // Format yang kita harapkan: "Bearer <token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      ok: false,
      message: "No token provided",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // simpan userId ke request, bisa dipakai di controller lain
    req.userId = payload.uid;
    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    return res.status(401).json({
      ok: false,
      message: "Invalid or expired token",
    });
  }
}