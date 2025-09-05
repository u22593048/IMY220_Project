import { Router } from 'express';
const r = Router();

r.post('/signin', (req,res)=>{
  const { email } = req.body;
  return res.json({
    user: { id: 'u1', name: 'Jacques', email },
    token: 'dummy-token-123'
  });
});

r.post('/signup', (req,res)=>{
  const { email, name } = req.body;
  return res.status(201).json({
    user: { id: 'u' + Math.floor(Math.random()*1000), name, email },
    token: 'dummy-token-456'
  });
});

export default r;
