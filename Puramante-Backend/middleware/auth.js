import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/User.js";

dotenv.config();

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("_id role email");
    if (!user) {
      return res.status(401).json({ message: "Invalid token user" });
    }
    req.user = { id: user._id.toString(), role: user.role, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export async function requireAdmin(req, res, next) {
  try {
    await requireAuth(req, res, async () => {
      if (req.user?.role !== "admin") {
        return res.status(403).json({ message: "Forbidden: Admins only" });
      }
      next();
    });
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

