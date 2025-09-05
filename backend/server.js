// backend/server.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve to project root (server runs from backend/dist after Babel)
const PROJECT_ROOT = path.resolve(__dirname, "..", "..");
const PUBLIC_DIR   = path.join(PROJECT_ROOT, "frontend", "public");
const INDEX_HTML   = path.join(PUBLIC_DIR, "index.html");

const app = express();
app.use(express.json());
app.use(express.static(PUBLIC_DIR));

// --- D1 auth stubs (same origin) ---
app.post("/api/auth/signin", (req, res) => {
  const { email } = req.body || {};
  res.json({ user: { id: "u1", name: "Jacques", email }, token: "dummy-token-123" });
});
app.post("/api/auth/signup", (req, res) => {
  const { email, name } = req.body || {};
  res.status(201).json({
    user: { id: "u" + Math.floor(Math.random() * 1000), name, email },
    token: "dummy-token-456"
  });
});

// SPA fallback
app.get("*", (_req, res) => res.sendFile(INDEX_HTML));

// Prefer 1337 since you’re calling it “backend”
const PORT = Number(process.env.PORT) || 1337;

// Helpful guard: if 1337 is in use, log a clear message
const server = app.listen(PORT, () => {
  const { port } = server.address();
  console.log(`CodeControl running on http://localhost:${port}`);
});
server.on("error", (err) => {
  if (err?.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is busy. Kill the old process or set PORT=another_number.`);
    process.exit(1);
  } else {
    throw err;
  }
});
