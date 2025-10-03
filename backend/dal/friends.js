import { db, OID } from "../db.js";
export const sendRequest = async (fromUserId, toUserId) => {
  const doc = { fromUserId: OID(fromUserId), toUserId: OID(toUserId), status:"pending", createdAt: new Date() };
  const { insertedId } = await db().collection("friendRequests").insertOne(doc);
  return { ...doc, _id: insertedId };
};
export const setStatus = (id, status) => db().collection("friendRequests")
  .findOneAndUpdate({ _id: OID(id) }, { $set: { status } }, { returnDocument:"after" }).then(r=>r.value);
export const accept = async (id) => {
  const req = await setStatus(id, "accepted");
  if (!req) return null;
  await db().collection("users").updateOne({ _id: req.fromUserId }, { $addToSet: { friends: req.toUserId }});
  await db().collection("users").updateOne({ _id: req.toUserId },   { $addToSet: { friends: req.fromUserId }});
  return req;
};
export const removeFriend = (a,b) => Promise.all([
  db().collection("users").updateOne({ _id: OID(a) }, { $pull: { friends: OID(b) } }),
  db().collection("users").updateOne({ _id: OID(b) }, { $pull: { friends: OID(a) } })
]);
