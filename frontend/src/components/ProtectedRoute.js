import React from "react";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null; 
  if (!user) {
    window.location.assign("/login");
    return null;
  }
  return children;
}
