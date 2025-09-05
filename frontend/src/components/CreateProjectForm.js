import React, { useState } from 'react';
export default function CreateProjectForm({ onCreate }) {
  const [name,setName]=useState('');
  const [desc,setDesc]=useState('');
  const nameValid = name.trim().length >= 3;
  const descValid = desc.trim().length >= 10;
  const canSubmit = nameValid && descValid;
  return (
    <form onSubmit={e=>{e.preventDefault(); if(canSubmit) onCreate({name,description:desc});}}>
      <label>Project name
        <input value={name} onChange={e=>setName(e.target.value)} required minLength={3}/>
      </label>
      <label>Description
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} required minLength={10}/>
      </label>
      <button type="submit" disabled={!canSubmit}>Create</button>
    </form>
  );
}
