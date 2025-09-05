import React, { useState } from 'react';

export default function LoginForm(){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

  const emailOK=/\S+@\S+\.\S+/.test(email);
  const passOK=password.length>=6;
  const valid=emailOK&&passOK;

  async function submit(e){
    e.preventDefault();
    if(!valid) return;
    const res=await fetch("/api/auth/signin",{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({email,password})
    });
    const json=await res.json();
    localStorage.setItem("cc_user",JSON.stringify(json.user));
    localStorage.setItem("cc_token",json.token);
    alert(`Signed in as ${json.user?.name||email}`);
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      <div className="form-row">
        <label className="label" htmlFor="le">Email</label>
        <input id="le" className={`input ${!emailOK&&email?"is-invalid":""}`} type="email"
               value={email} onChange={(e)=>setEmail(e.target.value)} required/>
      </div>
      <div className="form-row">
        <label className="label" htmlFor="lp">Password</label>
        <input id="lp" className={`input ${!passOK&&password?"is-invalid":""}`} type="password"
               value={password} onChange={(e)=>setPassword(e.target.value)} required minLength={6}/>
        {!passOK&&password?<p className="error">Minimum 6 characters.</p>:null}
      </div>
      <button className="btn btn-primary btn-block" disabled={!valid}>Sign in</button>
    </form>
  );
}
