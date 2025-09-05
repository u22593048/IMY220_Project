import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Project from "./pages/Project";

export default function App(){
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Splash/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home/>}/>
        <Route path="/profile/:id" element={<Profile/>}/>
        <Route path="/project/:id" element={<Project/>}/>
        <Route path="*" element={<main className="container page"><h2>404 Not Found</h2></main>} />
      </Routes>
    </BrowserRouter>
  );
}
