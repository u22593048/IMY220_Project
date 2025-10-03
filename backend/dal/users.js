
import { db } from "../db.js";
import { ObjectId } from "mongodb";


const projection = { projection: { passwordHash: 0 } };


export async function getUser(idOrUsername) {
  const users = db().collection("users");
  if (typeof idOrUsername === "string" && ObjectId.isValid(idOrUsername)) {
    return await users.findOne({ _id: new ObjectId(idOrUsername) }, projection);
  }
  return await users.findOne({ username: idOrUsername }, projection);
}


export async function getUserByIdOrNull(id) {
  if (!ObjectId.isValid(id)) return null;
  const users = db().collection("users");
  return await users.findOne({ _id: new ObjectId(id) }, projection);
}

/**
 * Find a user by username; returns null if not found.
 */
export async function getUserByUsername(username) {
  const users = db().collection("users");
  return await users.findOne({ username }, projection);
}
