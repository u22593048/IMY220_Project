// backend/dal/users.js
import { db } from "../db.js";
import { ObjectId } from "mongodb";

// Return public user (no passwordHash)
const projection = { projection: { passwordHash: 0 } };

/**
 * Find a user by Mongo _id (if valid) OR by username (fallback).
 * Accepts strings like "6792c7e..." or "me"/"alice".
 * If 'idOrUsername' looks like an ObjectId, search by _id,
 * otherwise search by username (case-sensitive; adjust if you need).
 */
export async function getUser(idOrUsername) {
  const users = db().collection("users");
  if (typeof idOrUsername === "string" && ObjectId.isValid(idOrUsername)) {
    return await users.findOne({ _id: new ObjectId(idOrUsername) }, projection);
  }
  return await users.findOne({ username: idOrUsername }, projection);
}

/**
 * Find a user strictly by _id; returns null if id not valid or not found.
 */
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
