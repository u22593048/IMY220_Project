import { useState } from "react";
import PropTypes from "prop-types";

export default function SearchInput({ onSearch }){
  const [q,setQ]=useState("");
  function submit(e){ e.preventDefault(); onSearch?.(q.trim()); }
  return (
    <form className="form flex" onSubmit={submit} role="search" aria-label="Search projects">
      <input className="input" placeholder="Search projects…" value={q}
             onChange={(e)=>setQ(e.target.value)} aria-label="Search query"/>
      <button className="btn btn-ghost" type="submit">Search</button>
    </form>
  );
}
SearchInput.propTypes={onSearch:PropTypes.func};
