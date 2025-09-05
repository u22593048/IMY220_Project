import React from 'react';
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { projects as all } from "../dummyData";
import ProjectView from "../components/ProjectView";
import EditProjectForm from "../components/EditProjectForm";
import FilesList from "../components/FilesList";
import MessagesList from "../components/MessagesList";

export default function Project(){
  const { id } = useParams();
  const p0 = all.find(x=>x.id===id) || all[0];
  const [project,setProject]=useState(p0);
  const [messages,setMessages]=useState(p0.messages||[]);

  return (
    <main className="container page grid">
      <nav className="badges">
        <Link className="badge" to={`/project/${id}`}>Overview</Link>
        <a className="badge" href="#files">Files</a>
        <a className="badge" href="#messages">Messages</a>
        <a className="badge" href="#edit">Edit</a>
      </nav>

      <ProjectView project={project}/>

      <section id="files">
        <FilesList files={project.files ?? []}/>
      </section>

      <section id="messages">
        <MessagesList messages={messages} onSend={(m)=>setMessages(prev=>[...prev,m])}/>
      </section>

      <section id="edit">
        <EditProjectForm project={project} onSave={(next)=>setProject(prev=>({...prev,...next}))}/>
      </section>
    </main>
  );
}
