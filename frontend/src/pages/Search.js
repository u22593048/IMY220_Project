import React, { useState } from "react";
import { Projects, Profile } from "../api";
import ProjectList from "../components/ProjectList";

export default function SearchPage(){
  const [q,setQ] = useState("");
  const [users,setUsers] = useState([]);
  const [projects,setProjects] = useState([]);
  const [busy,setBusy] = useState(false);
  const [err,setErr] = useState("");

  async function run(e){ e.preventDefault(); setBusy(true); setErr("");
    try{
      const [u,p] = await Promise.all([
        Profile.search(q),
        Projects.search(q)
      ]);
      setUsers(u||[]); setProjects(p||[]);
    }catch(e){ setErr(e.message || "Search failed"); }
    finally{ setBusy(false); }
  }

  return (
    <main className="container page grid">
      <form className="row gap" onSubmit={run}>
        <input className="input" placeholder="Search users, projects, #hashtags" value={q}
               onChange={e=>setQ(e.target.value)}/>
        <button className="btn btn-primary" disabled={busy}>Search</button>
      </form>
      {err && <div className="error">{err}</div>}

      <section className="card card-pad">
        <h3>Users</h3>
        <ul className="list">{users.map(u => <li key={u._id}>{u.name} (@{u.username})</li>)}</ul>
      </section>

      <section className="card card-pad">
        <h3>Projects</h3>
        <ProjectList projects={projects}/>
      </section>
    </main>
  );
}
