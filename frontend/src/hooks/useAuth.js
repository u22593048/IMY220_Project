import React, { createContext, useContext, useEffect, useState } from "react";
import { Auth } from "../api";

const AuthCtx = createContext({ user: null, setUser: () => {}, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const me = await Auth.me();
        if (alive) setUser(me || null);
      } catch {

      } finally {
        if (alive) setBooted(true);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <AuthCtx.Provider value={{ user, setUser, loading: !booted }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  return useContext(AuthCtx);
}
