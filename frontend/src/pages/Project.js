import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProjectView from "../components/ProjectView";        // keep your existing view component
import EditProjectForm from "../components/EditProjectForm"; // we’ll reuse it and call API
import FilesList from "../components/FilesList";
import MessagesList from "../components/MessagesList";      // keep if you have it
import { Projects } from "../api";

export default function Project(){
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [checkins, setCheckins] = useState([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function refresh(){
    try {
      const [p, c] = await Promise.all([Projects.get(id), Projects.checkins(id)]);
      setProject(p ? { ...p, tags: p.hashtags || [] } : null); // normalize for components expecting 'tags'
      setCheckins(c || []);
    } catch (e) {
      setErr(e.message || "Failed to load project");
    }
  }

  useEffect(() => { refresh(); /* eslint-disable-next-line */ }, [id]);

  async function onCheckout() {
    setBusy(true);
    try { await Projects.checkout(id); await refresh(); }
    catch(e){ setErr(e.message || "Checkout failed"); }
    finally{ setBusy(false); }
  }

  async function onCheckin(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const message = (fd.get("message") || "").trim();
    if (!message) return;
    setBusy(true);
    try { await Projects.checkin(id, message); e.currentTarget.reset(); await refresh(); }
    catch(e){ setErr(e.message || "Check-in failed"); }
    finally{ setBusy(false); }
  }

  async function onSave(patch){
    try {
      const sent = { ...patch };
      if (Array.isArray(patch.tags)) sent.hashtags = patch.tags;
      delete sent.tags;
      await Projects.update(id, sent);
      await refresh();
    } catch (e) {
      setErr(e.message || "Save failed");
    }
  }

  async function onDelete(){
    if (!confirm("Delete this project?")) return;
    try { await Projects.remove(id); window.location.assign("/home"); }
    catch(e){ setErr(e.message || "Delete failed"); }
  }

  if (!project) return <main className="container page">Loading…</main>;

  return (
    <main className="container page grid">
      {err && <div className="error">{err}</div>}

      <section className="card card-pad">
        <div className="flex between center">
          <h1 className="m0">{project.name}</h1>
          <div className="row gap">
            <button className="btn" onClick={onCheckout} disabled={busy}>Check out</button>
            <button className="btn" onClick={onDelete}>Delete</button>
          </div>
        </div>
        {project.description && <p className="help">{project.description}</p>}
      </section>

      <section className="card card-pad">
        <h3>Check in</h3>
        <form className="row gap" onSubmit={onCheckin}>
          <input className="input" name="message" placeholder="What did you do?" />
          <button className="btn btn-primary" disabled={busy}>Check in</button>
        </form>
      </section>

      <section>
        <ProjectView project={project}/>
      </section>

      <FilesList files={project.fileKeys ?? []}/>

      <section className="card card-pad">
        <h3>Recent check-ins</h3>
        <ul className="list">
          {checkins.map(ci => <li key={ci._id}>{ci.message}</li>)}
        </ul>
      </section>

      <section>
        <EditProjectForm project={project} onSave={onSave}/>
      </section>
    </main>
  );
}
