import React, { useState } from "react";
import { Friends as Api, Profile } from "../api";

export default function FriendsPage(){
  const [err,setErr] = useState("");
  const [busy,setBusy] = useState(false);
  const [username,setUsername] = useState("");

  async function send(){
    if(!username.trim()) return;
    setBusy(true); setErr("");
    try{
      const hits = await Profile.search(username.trim());
      const u = (hits||[]).find(x => x.username?.toLowerCase() === username.trim().toLowerCase());
      if(!u) throw new Error("User not found");
      await Api.send(u._id);
      setUsername("");
      alert("Request sent.");
    }catch(e){ setErr(e.message || "Failed"); }
    finally{ setBusy(false); }
  }

  return (
    <main className="container page grid">
      <section className="card card-pad">
        <h2>Add friend</h2>
        <div className="row gap">
          <input className="input" placeholder="Username"
                 value={username} onChange={e=>setUsername(e.target.value)}/>
          <button className="btn" onClick={send} disabled={busy}>Send</button>
        </div>
        {err && <div className="error mt1">{err}</div>}
      </section>

      <section className="card card-pad">
        <h3>Actions</h3>
        <p className="help">If you know a request id or user id, you can act on it here.</p>
        <div className="grid">
          <FriendActionForm label="Accept request"   placeholder="requestId"
                            onRun={id => Api.accept(id)} />
          <FriendActionForm label="Reject request"   placeholder="requestId"
                            onRun={id => Api.reject(id)} />
          <FriendActionForm label="Unfriend user"    placeholder="userId"
                            onRun={id => Api.unfriend(id)} />
        </div>
      </section>
    </main>
  );
}

function FriendActionForm({ label, placeholder, onRun }){
  const [id,setId] = useState("");
  const [busy,setBusy] = useState(false);
  const [err,setErr] = useState("");
  async function run(e){ e.preventDefault(); if(!id.trim()) return;
    setBusy(true); setErr("");
    try{ await onRun(id.trim()); setId(""); alert("Done."); }
    catch(e){ setErr(e.message || "Failed"); }
    finally{ setBusy(false); }
  }
  return (
    <form className="row gap" onSubmit={run}>
      <input className="input" placeholder={placeholder} value={id} onChange={e=>setId(e.target.value)}/>
      <button className="btn" disabled={busy}>{label}</button>
      {err && <span className="error">{err}</span>}
    </form>
  );
}
