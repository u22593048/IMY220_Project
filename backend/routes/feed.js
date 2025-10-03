import { Router } from "express";
import { db, OID } from "../db.js";
import { authRequired } from "../auth.js"; 

const r = Router();


r.get("/global", async (req, res) => {
  const limit = Math.max(1, Math.min(Number(req.query.limit) || 50, 200));
  const d = db();

  const feed = await d.collection("checkins").aggregate([
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



r.get("/local", authRequired, async (req, res) => {
  const limit = Math.max(1, Math.min(Number(req.query.limit) || 50, 200));
  const d = db();


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
