import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";         // keep your existing card
import EditProfileForm from "../components/EditProfileForm"; // updated to return {name, username}
import ProjectList from "../components/ProjectList";
import { Auth, Profile as Api, Projects } from "../api";

export default function Profile(){
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = id === "me" ? await Auth.me() : await Api.get(id);
        if (!alive) return;
        setUser(data || null);

        if (id === "me") {
          setProjects(await Projects.listMine());
        } else if (data?.username) {
          const ps = await Projects.search(data.username);
          setProjects(ps || []);
        } else {
          setProjects([]);
        }
      } catch (e) { setErr(e.message || "Failed to load profile"); }
    })();
    return () => { alive = false; };
  }, [id]);

  async function onSave(patch){
    try {
      const sent = {};
      if (patch.name) sent.name = patch.name;
      if (patch.username) sent.username = patch.username; // handle → username
      if (patch.bio) sent.bio = patch.bio;
      const updated = await Api.updateMe(sent);
      setUser(updated);
    } catch(e) { setErr(e.message || "Save failed"); }
  }

  async function onDelete(){
    if (!confirm("Delete your profile? This cannot be undone.")) return;
    try { await Api.deleteMe(); localStorage.removeItem("token"); window.location.assign("/signup"); }
    catch(e){ setErr(e.message || "Delete failed"); }
  }

  if (!user) return <main className="container page">Loading…</main>;

  return (
    <main className="container page grid grid-2">
      {err && <div className="error">{err}</div>}
      <div className="grid">
        <ProfileCard user={user}/>
        {/* Edit only for me */}
        {id === "me" && <EditProfileForm user={{ name:user.name, handle:user.username, bio:user.bio||"" }} onSave={onSave}/>}
        {id === "me" &&
          <section className="card card-pad" style={{marginTop:12}}>
            <h3>Danger zone</h3>
            <button className="btn" onClick={onDelete}>Delete my profile</button>
          </section>
        }
      </div>

      <section className="grid">
        <h2 className="m0">Projects</h2>
        <ProjectList projects={projects}/>
      </section>
    </main>
  );
}
