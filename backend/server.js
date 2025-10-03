import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { initDb } from "./db.js";
import authRoutes from "./routes/auth.js";
import profileRoutes from "./routes/profile.js";
import projectsRoutes from "./routes/projects.js";
import friendsRoutes from "./routes/friends.js";
import feedRoutes from "./routes/feed.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths: resolve from process.cwd() so it works in both src and dist builds
const PROJECT_ROOT = path.resolve(process.cwd());                 // => /app
const PUBLIC_DIR   = path.resolve(PROJECT_ROOT, "frontend/public"); // => /app/frontend/public
const INDEX_HTML   = path.resolve(PUBLIC_DIR, "index.html");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(PUBLIC_DIR));

// API (prefix stays /api to match your D1 client)
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/friends", friendsRoutes);
app.use("/api/feed", feedRoutes);

// Health
app.get("/api/health", (_req,res)=> res.json({ ok:true, service:"CodeControl API" }));

// SPA fallback
app.get("*", (_req, res) => res.sendFile(INDEX_HTML));

// Boot
const PORT = Number(process.env.PORT) || 1337;
const start = async () => {
  await initDb(process.env.MONGODB_URI);
  const server = app.listen(PORT, () => {
    const { port } = server.address();
    console.log(`CodeControl running on http://localhost:${port}`);
  });
  server.on("error", (err) => {
    if (err?.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is busy. Kill the old process or set PORT=another_number.`);
      process.exit(1);
    } else { throw err; }
  });
};
start();
