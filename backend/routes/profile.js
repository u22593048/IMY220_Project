import { Router } from "express";
import { ObjectId } from "mongodb";
import { authRequired } from "../auth.js";
import { db } from "../db.js";

const r = Router();
const users = () => db().collection("users");
const pub = { projection: { passwordHash: 0 } };


r.get("/me", authRequired, async (req, res) => {
  try {
    const _id = new ObjectId(req.userId);
    const me = await users().findOne({ _id }, pub);
    if (!me) return res.status(404).json({ error: "User not found" });
    res.json(me);
  } catch (e) {
    console.error("[GET /profile/me]", e);
    res.status(500).json({ error: "Profile load failed" });
  }
});


r.get("/search", async (req, res) => {
  const q = String(req.query.q || "").trim();
  if (!q) return res.json([]);
  try {
    const results = await users().find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { name:     { $regex: q, $options: "i" } },
        { email:    { $regex: q, $options: "i" } },
      ]
    }, pub).limit(20).toArray();
    res.json(results);
  } catch (e) {
    console.error("[GET /profile/search]", e);
    res.status(500).json({ error: "Search failed" });
  }
});

r.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    let user = null;
    if (ObjectId.isValid(id)) {
      user = await users().findOne({ _id: new ObjectId(id) }, pub);
    } else {
      user = await users().findOne({ username: id }, pub);
    }
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (e) {
    console.error("[GET /profile/:id]", e);
    res.status(500).json({ error: "Profile load failed" });
  }
});


r.patch("/me", authRequired, async (req, res) => {
  try {
    const _id = new ObjectId(req.userId);
    const patch = {};
    const { name, username, bio } = req.body || {};
    if (typeof name === "string") patch.name = name;
    if (typeof username === "string") patch.username = username;
    if (typeof bio === "string") patch.bio = bio;

    const { value } = await users().findOneAndUpdate(
      { _id }, { $set: patch, $currentDate: { updatedAt: true } },
      { returnDocument: "after", ...pub }
    );
    if (!value) return res.status(404).json({ error: "User not found" });
    res.json(value);
  } catch (e) {
    console.error("[PATCH /profile/me]", e);
    res.status(500).json({ error: "Profile update failed" });
  }
});


r.delete("/me", authRequired, async (req, res) => {
  try {
    const _id = new ObjectId(req.userId);
    const out = await users().deleteOne({ _id });
    res.json({ ok: out.acknowledged, deletedCount: out.deletedCount || 0 });
  } catch (e) {
    console.error("[DELETE /profile/me]", e);
    res.status(500).json({ error: "Profile delete failed" });
  }
});

export default r;
