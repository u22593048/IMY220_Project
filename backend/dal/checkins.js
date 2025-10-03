import { db, OID } from "../db.js";
export async function addCheckin({ projectId, userId, message }) {
  const doc = { projectId: OID(projectId), userId: OID(userId), message, createdAt: new Date() };
  const { insertedId } = await db().collection("checkins").insertOne(doc);
  return { ...doc, _id: insertedId };
}
export const listProjectCheckins = (projectId, limit=50) => db().collection("checkins")
   .find({ projectId: OID(projectId) }).sort({ createdAt:-1 }).limit(limit).toArray();
export const listGlobalFeed = (limit=50) => db().collection("checkins").aggregate([
  { $sort: { createdAt:-1 } }, { $limit: limit },
  { $lookup: { from:"projects", localField:"projectId", foreignField:"_id", as:"project" } },
  { $lookup: { from:"users", localField:"userId", foreignField:"_id", as:"user" } }
]).toArray();
export const listLocalFeed = async (userId, limit=50) => {
  const me = await db().collection("users").findOne({ _id: OID(userId) }, { projection: { friends:1 } });
  const ids = [OID(userId), ...(me?.friends||[])];
  return db().collection("checkins").aggregate([
    { $match: { userId: { $in: ids } } },
    { $sort: { createdAt:-1 } }, { $limit: limit },
    { $lookup: { from:"projects", localField:"projectId", foreignField:"_id", as:"project" } },
    { $lookup: { from:"users", localField:"userId", foreignField:"_id", as:"user" } }
  ]).toArray();
};
