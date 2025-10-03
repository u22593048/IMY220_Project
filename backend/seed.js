// backend/src/seed.js
import { initDb, db } from "./db.js";
import bcrypt from "bcrypt";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI not set");

  await initDb(uri);
  const d = db();
  console.log(`[SEED] Connected DB: ${d.databaseName}`);

  const users = d.collection("users");
  const projects = d.collection("projects");
  const checkins = d.collection("checkins");
  const friendRequests = d.collection("friendRequests");

  // wipe
  await Promise.all([
    users.deleteMany({}),
    projects.deleteMany({}),
    checkins.deleteMany({}),
    friendRequests.deleteMany({}),
  ]);
  console.log("[SEED] Collections cleared.");

  // users
  const pwHash = await bcrypt.hash("Passw0rd!", 10);
  const { insertedIds: userIds } = await users.insertMany([
    { name: "Alice", username: "alice", email: "a@ex.com", passwordHash: pwHash, friends: [], createdAt: new Date() },
    { name: "Bob",   username: "bob",   email: "b@ex.com", passwordHash: pwHash, friends: [], createdAt: new Date() },
  ]);
  await users.updateOne({ _id: userIds[0] }, { $addToSet: { friends: userIds[1] }});
  await users.updateOne({ _id: userIds[1] }, { $addToSet: { friends: userIds[0] }});

  // projects
  const now = new Date();
  const { insertedIds: projIds } = await projects.insertMany([
    {
      ownerId: userIds[0], memberIds: [userIds[0], userIds[1]],
      name: "Compiler-Lab", description: "Toy compiler", type: "web",
      hashtags: ["compiler", "lab"], imageUrl: null, fileKeys: [],
      checkedOutBy: null, createdAt: now, updatedAt: now
    },
    {
      ownerId: userIds[1], memberIds: [userIds[1]],
      name: "AT-AT mini", description: "API Threat Scanner", type: "data",
      hashtags: ["api", "security"], imageUrl: null, fileKeys: [],
      checkedOutBy: null, createdAt: now, updatedAt: now
    },
  ]);

  // checkins
  await checkins.insertMany([
    { projectId: projIds[0], userId: userIds[0], message: "Initial commit", createdAt: new Date(Date.now() - 86400000) },
    { projectId: projIds[0], userId: userIds[1], message: "Added README",   createdAt: new Date() },
    { projectId: projIds[1], userId: userIds[1], message: "Setup repo",     createdAt: new Date() },
  ]);

  const [uc, pc, cc] = await Promise.all([
    users.countDocuments(), projects.countDocuments(), checkins.countDocuments()
  ]);

  console.log(`[SEED] Done. users=${uc} projects=${pc} checkins=${cc}  (password for alice/bob: Passw0rd!)`);
}

main().then(() => process.exit(0)).catch(err => {
  console.error("[SEED] FAILED:", err);
  process.exit(1);
});
