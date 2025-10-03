import { Router } from "express";
import { authRequired } from "../auth.js";
import { sendRequest, accept, setStatus, removeFriend } from "../dal/friends.js";

const r = Router();
r.post("/requests", authRequired, async (req,res)=> res.status(201).json(await sendRequest(req.userId, req.body.toUserId)));
r.post("/requests/:id/accept", authRequired, async (req,res)=> res.json(await accept(req.params.id) || { error:"Not found" }));
r.post("/requests/:id/reject", authRequired, async (req,res)=> res.json(await setStatus(req.params.id, "rejected")));
r.delete("/:userId", authRequired, async (req,res)=> { await removeFriend(req.userId, req.params.userId); res.json({ ok:true }); });
export default r;
