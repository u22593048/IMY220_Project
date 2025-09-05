import { useState } from "react";
import PropTypes from "prop-types";

export default function EditProjectForm({ project, onSave }){
  const [name,setName]=useState(project.name ?? "");
  const [description,setDescription]=useState(project.description ?? "");
  const [tags,setTags]=useState((project.tags ?? []).join(", "));
  const valid=name.trim().length>=3 && description.trim().length>=10;

  function submit(e){
    e.preventDefault();
    if(!valid) return;
    onSave?.({name,description,tags:tags.split(",").map(s=>s.trim()).filter(Boolean)});
  }

  return (
    <form className="card card-pad form" onSubmit={submit} noValidate>
      <h3 className="m0">Edit Project</h3>
      <div className="form-row">
        <label className="label" htmlFor="p-name">Name</label>
        <input id="p-name" className={`input ${name.trim().length<3?"is-invalid":""}`} value={name}
               onChange={e=>setName(e.target.value)} required minLength={3}/>
      </div>
      <div className="form-row">
        <label className="label" htmlFor="p-desc">Description</label>
        <textarea id="p-desc" className={`textarea ${description.trim().length<10?"is-invalid":""}`} value={description}
                  onChange={e=>setDescription(e.target.value)} required minLength={10}></textarea>
      </div>
      <div className="form-row">
        <label className="label" htmlFor="p-tags">Tags (comma-separated)</label>
        <input id="p-tags" className="input" value={tags} onChange={e=>setTags(e.target.value)}/>
      </div>
      <div className="flex">
        <button className="btn btn-primary" type="submit" disabled={!valid}>Save</button>
        <button className="btn btn-ghost" type="button" onClick={()=>{
          setName(project.name ?? ""); setDescription(project.description ?? ""); setTags((project.tags ?? []).join(", "));
        }}>Reset</button>
      </div>
    </form>
  );
}
EditProjectForm.propTypes={ project:PropTypes.object.isRequired, onSave:PropTypes.func };
