import React from 'react';
import { Link, useLocation } from "react-router-dom";

export default function Header(){
  const { pathname } = useLocation();
  if (pathname === "/") return null;

  return (
    <header className="nav">
      <div className="brand">
        <img src="/assets/images/codecontrol-logo.png" alt="CodeControl logo"/>
        <Link to="/home">CodeControl</Link>
      </div>
      <nav className="nav-links">
        <Link to="/home">Home</Link>
        <Link to="/profile/u1">Profile</Link>
        <Link to="/project/p1">Project</Link>
      </nav>
      <div className="nav-right">v0.1</div>
    </header>
  );
}
