import { useState } from "react";
import PropTypes from "prop-types";

export default function EditProfileForm({ user, onSave }){
  const [name,setName]=useState(user.name ?? "");
  const [handle,setHandle]=useState(user.handle ?? "");
  const valid=name.trim().length>=2 && handle.trim().length>=2;

  function submit(e){
    e.preventDefault();
    if(!valid) return;
    onSave?.({name,handle});
  }

  return (
    <form className="card card-pad form" onSubmit={submit} noValidate>
      <h3 className="m0">Edit Profile</h3>
      <div className="form-row">
        <label className="label" htmlFor="name">Name</label>
        <input id="name" className={`input ${name.trim().length<2?"is-invalid":""}`}
               value={name} onChange={e=>setName(e.target.value)} required minLength={2}/>
      </div>
      <div className="form-row">
        <label className="label" htmlFor="handle">Handle</label>
        <input id="handle" className={`input ${handle.trim().length<2?"is-invalid":""}`}
               value={handle} onChange={e=>setHandle(e.target.value)} required minLength={2}/>
      </div>
      <div className="flex">
        <button className="btn btn-primary" type="submit" disabled={!valid}>Save</button>
        <button className="btn btn-ghost" type="button" onClick={()=>{setName(user.name);setHandle(user.handle);}}>Reset</button>
      </div>
    </form>
  );
}
EditProfileForm.propTypes={ user:PropTypes.object.isRequired, onSave:PropTypes.func };
