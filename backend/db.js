import { MongoClient, ObjectId } from "mongodb";

let _client; let _db;
export const OID = (s) => new ObjectId(s);

export async function initDb(uri) {
  if (_db) return _db;
  if (!uri) throw new Error("MONGODB_URI not set");
  _client = new MongoClient(uri, { maxPoolSize: 10 });
  await _client.connect();
  _db = _client.db(); 

  await _db.collection("users").createIndexes([
    { key: { username: 1 }, name: "username_unique", unique: true },
    { key: { email: 1 },    name: "email_unique",    unique: true },
    { key: { name: "text" }, name: "user_name_text" }
  ]);
  await _db.collection("projects").createIndexes([
    { key: { name: "text" }, name: "proj_name_text" },
    { key: { hashtags: 1 },  name: "hashtags_1" },
    { key: { type: 1 },      name: "type_1" },
    { key: { ownerId: 1 },   name: "ownerId_1" }
  ]);
  await _db.collection("checkins").createIndexes([
    { key: { projectId: 1, createdAt: -1 }, name: "projectId_createdAt" },
    { key: { userId: 1, createdAt: -1 },    name: "userId_createdAt" }
  ]);
  await _db.collection("friendRequests").createIndexes([
    { key: { toUserId: 1, status: 1 }, name: "toUser_status" }
  ]);
  return _db;
}

export const db = () => _db;
