import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Splash() {
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) window.location.assign("/home");
  }, []);

  return (
    <main className="container page splash-hero">
      <section className="card card-pad grid">
        <h1 className="hero-title">CodeControl</h1>
        <p className="hero-sub">Collaborate on code. Share progress. Ship faster.</p>

        <div className="flex mt2">
          <Link className="btn btn-primary" to="/login">Login</Link>
          <Link className="btn" to="/signup">Sign Up</Link>
        </div>

        <div className="badges mt2">
          <span className="badge">Projects</span>
          <span className="badge">Messages</span>
          <span className="badge">Files</span>
        </div>
      </section>
    </main>
  );
}
