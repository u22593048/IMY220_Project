import React from 'react';
import { useState } from "react";
import SearchInput from "../components/SearchInput";
import ProjectList from "../components/ProjectList";
import { projects as seed } from "../dummyData";

export default function Home(){
  const [projects,setProjects]=useState(seed);

  function onSearch(q){
    if(!q) return setProjects(seed);
    const s=q.toLowerCase();
    setProjects(seed.filter(p =>
      p.name.toLowerCase().includes(s) ||
      p.description.toLowerCase().includes(s) ||
      (p.tags||[]).some(t=>t.toLowerCase().includes(s))
    ));
  }

  return (
    <main className="container page grid">
      <SearchInput onSearch={onSearch}/>
      <ProjectList projects={projects}/>
    </main>
  );
}
