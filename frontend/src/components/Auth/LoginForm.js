import React, { useState } from "react";
import { Auth } from "../../api";

export default function LoginForm(){
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const userOK = usernameOrEmail.trim().length >= 3;
  const passOK = password.length >= 6;
  const valid = userOK && passOK;

  async function submit(e){
    e.preventDefault();
    if (!valid) return;
    setErr("");
    setBusy(true);
    try {
      const { token } = await Auth.login({ usernameOrEmail, password });
      localStorage.setItem("token", token);
      window.location.assign("/home");
    } catch (ex) {
      setErr(ex.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form grid" onSubmit={submit} noValidate>
      <div className="form-row">
        <label className="label" htmlFor="le">Username or Email</label>
        <input
          id="le"
          className={`input ${!userOK && usernameOrEmail ? "is-invalid" : ""}`}
          value={usernameOrEmail}
          onChange={(e)=>setUsernameOrEmail(e.target.value)}
          placeholder="username or email"
          required
        />
      </div>

      <div className="form-row">
        <label className="label" htmlFor="lp">Password</label>
        <input
          id="lp"
          className={`input ${!passOK && password ? "is-invalid" : ""}`}
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>

      <button className="btn btn-primary btn-block" type="submit" disabled={!valid || busy}>
        {busy ? "Signing in…" : "Sign in"}
      </button>

      {err ? <p className="error" style={{marginTop:8}}>{err}</p> : null}
    </form>
  );
}
