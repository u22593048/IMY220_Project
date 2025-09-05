import React, { useState } from 'react';

export default function SignUpForm(){
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [repeat,setRepeat]=useState("");

  const nameOK=name.trim().length>=2;
  const emailOK=/\S+@\S+\.\S+/.test(email);
  const passOK=password.length>=6;
  const matchOK=repeat===password && repeat.length>0;
  const valid=nameOK&&emailOK&&passOK&&matchOK;

  async function submit(e){
    e.preventDefault();
    if(!valid) return;
    const res=await fetch("/api/auth/signup",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({name,email,password})
    });
    const json=await res.json();
    alert(`User created: ${json.user?.name} (${json.user?.id})`);
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="form-row">
        <label className="label" htmlFor="sn">Name</label>
        <input id="sn" className={`input ${!nameOK&&name?"is-invalid":""}`}
               value={name} onChange={(e)=>setName(e.target.value)} required minLength={2}/>
      </div>
      <div className="form-row">
        <label className="label" htmlFor="se">Email</label>
        <input id="se" className={`input ${!emailOK&&email?"is-invalid":""}`} type="email"
               value={email} onChange={(e)=>setEmail(e.target.value)} required/>
      </div>
      <div className="form-row">
        <label className="label" htmlFor="sp">Password</label>
        <input id="sp" className={`input ${!passOK&&password?"is-invalid":""}`} type="password"
               value={password} onChange={(e)=>setPassword(e.target.value)} required minLength={6}/>
      </div>
      <div className="form-row">
        <label className="label" htmlFor="sr">Repeat Password</label>
        <input id="sr" className={`input ${!matchOK&&repeat?"is-invalid":""}`} type="password"
               value={repeat} onChange={(e)=>setRepeat(e.target.value)} required/>
        {!matchOK&&repeat?<p className="error">Passwords must match.</p>:null}
      </div>
      <button className="btn btn-primary btn-block" disabled={!valid}>Sign up</button>
    </form>
  );
}
