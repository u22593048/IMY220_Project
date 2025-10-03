import { Router } from "express";
import { db, OID } from "../db.js";
import { authRequired } from "../auth.js"; // ← if your auth guard lives elsewhere, adjust this import

const r = Router();

/**
 * GET /api/feed/global
 * Public feed: latest check-ins across all projects/users.
 * Optional: ?limit=50  (default 50, max 200)
 */
r.get("/global", async (req, res) => {
  const limit = Math.max(1, Math.min(Number(req.query.limit) || 50, 200));
  const d = db();

  const feed = await d.collection("checkins").aggregate([
    { $sort: { createdAt: -1 } },
    { $limit: limit },
    // attach minimal project info
    { $lookup: { from: "projects", localField: "projectId", foreignField: "_id", as: "project" } },
    { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },
    // attach minimal user info
    { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    // shape the response (keep it small)
    { $project: {
        _id: 1,
        message: 1,
        createdAt: 1,
        project: { _id: "$project._id", name: "$project.name" },
        user:    { _id: "$user._id", name: "$user.name", username: "$user.username" }
    }}
  ]).toArray();

  res.json(feed);
});


/**
 * GET /api/feed/local
 * Authenticated feed: latest check-ins by you + your friends.
 * Optional: ?limit=50  (default 50, max 200)
 */
r.get("/local", authRequired, async (req, res) => {
  const limit = Math.max(1, Math.min(Number(req.query.limit) || 50, 200));
  const d = db();

  // find my friends
  const me = await d.collection("users").findOne(
    { _id: OID(req.userId || req.user?.sub) },
    { projection: { friends: 1 } }
  );
  const ids = [OID(req.userId || req.user?.sub), ...((me?.friends || []).map(OID))];

  const feed = await d.collection("checkins").aggregate([
    { $match: { userId: { $in: ids } } },
    { $sort: { createdAt: -1 } },
    { $limit: limit },
    { $lookup: { from: "projects", localField: "projectId", foreignField: "_id", as: "project" } },
    { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },
    { $lookup: { from: "users", localField: "userId", foreignField: "_id", as: "user" } },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    { $project: {
        _id: 1,
        message: 1,
        createdAt: 1,
        project: { _id: "$project._id", name: "$project.name" },
        user:    { _id: "$user._id", name: "$user.name", username: "$user.username" }
    }}
  ]).toArray();

  res.json(feed);
});

export default r;
