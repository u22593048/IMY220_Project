import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { db, OID } from "./db.js";

const TOKEN_TTL = "7d";

export function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), u: user.username }, process.env.JWT_SECRET || "dev", { expiresIn: TOKEN_TTL });
}

export function authRequired(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Missing token" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev");
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export async function findUserByLogin(usernameOrEmail) {
  const users = db().collection("users");
  const user = await users.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
  });
  return user;
}

export const hashPassword = (pw) => bcrypt.hash(pw, 10);
export const verifyPassword = (pw, hash) => bcrypt.compare(pw, hash);
