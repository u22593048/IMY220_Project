import { Router } from "express";
import { authRequired } from "../auth.js";
import { createProject, getProject, listProjects, updateProject, deleteProject,
         addMember, setCheckout, clearCheckout, searchProjects } from "../dal/projects.js";
import { addCheckin, listProjectCheckins } from "../dal/checkins.js";

const r = Router();
r.get("/", authRequired, async (req,res)=> res.json(await listProjects(req.userId)));
r.get("/search", async (req,res)=> res.json(await searchProjects(String(req.query.q||""))));
r.post("/", authRequired, async (req,res)=> res.status(201).json(await createProject({ ownerId:req.userId, ...req.body })));
r.get("/:id", async (req,res)=> res.json(await getProject(req.params.id)));
r.patch("/:id", authRequired, async (req,res)=> res.json(await updateProject(req.params.id, req.body||{})));
r.delete("/:id", authRequired, async (req,res)=> { await deleteProject(req.params.id); res.json({ ok:true }); });
r.post("/:id/members", authRequired, async (req,res)=> { await addMember(req.params.id, req.body.userId); res.json({ ok:true }); });
r.post("/:id/checkout", authRequired, async (req,res)=> { await setCheckout(req.params.id, req.userId); res.json({ ok:true }); });
r.post("/:id/checkin", authRequired, async (req,res)=> res.status(201).json(await addCheckin({ projectId:req.params.id, userId:req.userId, message:req.body.message })));
r.get("/:id/checkins", async (req,res)=> res.json(await listProjectCheckins(req.params.id)));
export default r;
