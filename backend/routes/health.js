import { Router } from 'express';
const r = Router();
r.get('/', (_req,res) => res.json({ ok:true, service:'CodeControl API' }));
export default r;
