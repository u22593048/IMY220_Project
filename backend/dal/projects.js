import { db, OID } from "../db.js";

export async function createProject({ ownerId, name, description, type, hashtags, imageUrl, fileKeys }) {
  const now = new Date();
  const doc = { ownerId: OID(ownerId), memberIds:[OID(ownerId)], name, description, type, hashtags, imageUrl: imageUrl||null,
                fileKeys: fileKeys||[], checkedOutBy: null, createdAt: now, updatedAt: now };
  const { insertedId } = await db().collection("projects").insertOne(doc);
  return { ...doc, _id: insertedId };
}
export const getProject = (id) => db().collection("projects").findOne({ _id: OID(id) });
export const listProjects = (ownerId) => db().collection("projects").find({ ownerId: OID(ownerId) }).toArray();
export const updateProject = (id, patch) => db().collection("projects")
  .findOneAndUpdate({ _id: OID(id) }, { $set: { ...patch, updatedAt: new Date() } }, { returnDocument:"after" }).then(r=>r.value);
export const deleteProject = (id) => db().collection("projects").deleteOne({ _id: OID(id) });
export const addMember = (id, userId) => db().collection("projects")
  .updateOne({ _id: OID(id) }, { $addToSet: { memberIds: OID(userId) }, $set: { updatedAt: new Date() } });
export const setCheckout = (id, userId) => db().collection("projects").updateOne({ _id: OID(id) }, { $set: { checkedOutBy: OID(userId) } });
export const clearCheckout = (id) => db().collection("projects").updateOne({ _id: OID(id) }, { $set: { checkedOutBy: null } });
export const searchProjects = (q) => db().collection("projects")
  .find({ $or: [{ name: { $regex: q, $options: "i" } }, { type: { $regex: q, $options: "i" } }, { hashtags: { $in: [q] } }] }).limit(20).toArray();
