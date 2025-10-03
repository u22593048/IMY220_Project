import { Router } from "express";
import { db } from "../db.js";
import { findUserByLogin, hashPassword, verifyPassword, signToken } from "../auth.js";

const r = Router();

r.post("/signup", async (req, res) => {
  try {
    const { name, username, email, password } = req.body || {};
    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }
    const users = db().collection("users");

    const exists = await users.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(409).json({ error: "User exists" });

    const doc = {
      name, username, email,
      passwordHash: await hashPassword(password),
      avatarUrl: null, bio: "",
      friends: [], createdAt: new Date()
    };
    const { insertedId } = await users.insertOne(doc);

    const user = await users.findOne(
      { _id: insertedId },
      { projection: { passwordHash: 0 } }
    );
    const token = signToken({ _id: insertedId, username });
    res.status(201).json({ user, token });
  } catch (e) {
    console.error("[/auth/signup]", e);
    res.status(500).json({ error: "Signup failed" });
  }
});

r.post("/login", async (req, res) => {
  try {
    // Accept both "usernameOrEmail" (API client) and "username"/"email" (plain forms)
    const body = req.body || {};
    const usernameOrEmail =
      body.usernameOrEmail || body.username || body.email || "";
    const password = body.password || "";

    if (!usernameOrEmail || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const user = await findUserByLogin(usernameOrEmail);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { passwordHash, ...pub } = user;
    res.json({ user: pub, token: signToken(user) });
  } catch (e) {
    console.error("[/auth/login]", e);
    res.status(500).json({ error: "Login failed" });
  }
});

r.post("/logout", (_req, res) => res.json({ ok: true }));
export default r;
