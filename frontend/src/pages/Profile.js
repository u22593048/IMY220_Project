import React from 'react';
import { useParams } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import EditProfileForm from "../components/EditProfileForm";
import ProjectList from "../components/ProjectList";
import { currentUser, projects as all } from "../dummyData";

export default function Profile(){
  const { id } = useParams();
  const user = { ...currentUser, id };
  const projects = all.filter(p => p.ownerId===id || p.memberIds?.includes(id));

  return (
    <main className="container page grid grid-2">
      <div className="grid">
        <ProfileCard user={user}/>
        <EditProfileForm user={user} onSave={(data)=>console.log("save profile", data)}/>
      </div>
      <section className="grid">
        <h2 className="m0">Projects</h2>
        <ProjectList projects={projects.length?projects:all}/>
      </section>
    </main>
  );
}
