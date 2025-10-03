import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Auth } from "../api";

export default function Header() {
  const { pathname } = useLocation();


  if (pathname === "/") return null;

  async function onLogout(e) {
    e.preventDefault();
    try { await Auth.logout(); } catch {}
    localStorage.removeItem("token");
    window.location.assign("/login");
  }

  return (
    <header className="nav">
      <div className="brand">
        <img src="/assets/images/codecontrol-logo.png" alt="CodeControl logo"/>
        <Link to="/home">CodeControl</Link>
      </div>
      <nav className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/feed">Feed</Link>
        <Link to="/friends">Friends</Link>
        <Link to="/search">Search</Link>
        <Link to="/profile/me">Profile</Link>
      </nav>
      <div className="nav-right">
        <a href="#" onClick={onLogout}>Logout</a>
      </div>
    </header>
  );
}
