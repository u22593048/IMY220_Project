import React, { useEffect, useState } from "react";
import { Feed } from "../api";

export default function FeedPage(){
  const [globalFeed,setGlobal] = useState([]);
  const [localFeed,setLocal] = useState([]);
  const [err,setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async ()=>{
      try{
        const g = await Feed.global();
        if(!alive) return;
        setGlobal(g||[]);
        try{ setLocal(await Feed.local()); }catch{}
      }catch(e){ setErr(e.message || "Failed to load feed"); }
    })();
    return ()=>{ alive=false; };
  }, []);

  return (
    <main className="container page grid">
      {err && <div className="error">{err}</div>}
      <section className="card card-pad">
        <h2>Your circle</h2>
        <ul className="list">
          {localFeed.map(item => (
            <li key={item._id}>
              <b>{item.user?.name}</b> → <i>{item.project?.name}</i>: “{item.message}”
            </li>
          ))}
        </ul>
      </section>
      <section className="card card-pad">
        <h2>Global</h2>
        <ul className="list">
          {globalFeed.map(item => (
            <li key={item._id}>
              <b>{item.user?.name}</b> → <i>{item.project?.name}</i>: “{item.message}”
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
