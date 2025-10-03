import React, { useEffect, useState } from "react";
import SearchInput from "../components/SearchInput"; 
import ProjectList from "../components/ProjectList";
import CreateProjectForm from "../components/CreateProjectForm";
import { Projects } from "../api";

export default function Home(){
  const [projects, setProjects] = useState([]);
  const [all, setAll] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const list = await Projects.listMine();
        if (!alive) return;
        setProjects(list || []);
        setAll(list || []);
      } catch (e) {
        setErr(e.message || "Failed to load projects");
      }
    })();
    return () => { alive = false; };
  }, []);

  function onSearch(q){
    if (!q) return setProjects(all);
    const s = q.toLowerCase();
    setProjects(all.filter(p =>
      (p.name||"").toLowerCase().includes(s) ||
      (p.description||"").toLowerCase().includes(s) ||
      (p.hashtags||[]).some(t => (t||"").toLowerCase().includes(s))
    ));
  }

  async function onCreate({ name, description }){
    try {
      await Projects.create({ name, description, hashtags: [] });
      const list = await Projects.listMine();
      setAll(list || []);
      setProjects(list || []);
    } catch (e) {
      setErr(e.message || "Create failed");
    }
  }

  return (
    <main className="container page grid">
      <section className="card card-pad">
        <h2 className="m0">Create project</h2>
        <CreateProjectForm onCreate={onCreate}/>
      </section>

      <section className="card card-pad">
        <SearchInput onSearch={onSearch}/>
      </section>

      {err && <div className="error">{err}</div>}

      <ProjectList projects={projects}/>
    </main>
  );
}
