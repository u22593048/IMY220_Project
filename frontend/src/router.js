import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Project from './pages/Project';

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Splash defaultTab="login" />} />
      <Route path="/signup" element={<Splash defaultTab="signup" />} />
      <Route path="/home" element={<Home />} />
      <Route path="/profile/:id" element={<Profile />} />
      <Route path="/project/:id" element={<Project />} />
    </Routes>
  );
}
