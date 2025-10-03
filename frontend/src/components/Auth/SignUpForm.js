import React, { useState } from "react";
import { Auth } from "../../api";

export default function SignUpForm(){
  const [name,setName] = useState("");
  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [repeat,setRepeat] = useState("");
  const [busy,setBusy] = useState(false);
  const [err,setErr] = useState("");

  const nameOK = name.trim().length >= 2;
  const userOK = username.trim().length >= 3;
  const emailOK = /\S+@\S+\.\S+/.test(email);
  const passOK = password.length >= 6;
  const matchOK = repeat === password && repeat.length > 0;
  const valid = nameOK && userOK && emailOK && passOK && matchOK;

  async function submit(e){
    e.preventDefault();
    if (!valid) return;
    setErr("");
    setBusy(true);
    try {
      const { token, user } = await Auth.signup({ name, username, email, password });
      localStorage.setItem("token", token);
      alert(`Welcome ${user.name} (@${user.username})`);
      window.location.assign("/home");
    } catch (ex) {
      setErr(ex.message || "Signup failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form grid" onSubmit={submit} noValidate>
      <div className="form-row">
        <label className="label" htmlFor="sn">Full name</label>
        <input id="sn" className={`input ${!nameOK && name ? "is-invalid":""}`}
               value={name} onChange={(e)=>setName(e.target.value)} required />
      </div>

      <div className="form-row">
        <label className="label" htmlFor="su">Username</label>
        <input id="su" className={`input ${!userOK && username ? "is-invalid":""}`}
               value={username} onChange={(e)=>setUsername(e.target.value)} required minLength={3}/>
      </div>

      <div className="form-row">
        <label className="label" htmlFor="se">Email</label>
        <input id="se" className={`input ${!emailOK && email ? "is-invalid":""}`} type="email"
               value={email} onChange={(e)=>setEmail(e.target.value)} required />
      </div>

      <div className="form-row">
        <label className="label" htmlFor="sp">Password</label>
        <input id="sp" className={`input ${!passOK && password ? "is-invalid":""}`} type="password"
               value={password} onChange={(e)=>setPassword(e.target.value)} required minLength={6}/>
      </div>

      <div className="form-row">
        <label className="label" htmlFor="sr">Repeat Password</label>
        <input id="sr" className={`input ${!matchOK && repeat ? "is-invalid":""}`} type="password"
               value={repeat} onChange={(e)=>setRepeat(e.target.value)} required />
      </div>

      <button className="btn btn-primary btn-block" type="submit" disabled={!valid || busy}>
        {busy ? "Creating…" : "Sign up"}
      </button>

      {err ? <p className="error" style={{marginTop:8}}>{err}</p> : null}
    </form>
  );
}
