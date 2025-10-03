import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";

dotenv.config();

const NUM_USERS = 40;          
const NUM_PROJECTS = 60;
const MAX_MEMBERS_PER_PROJECT = 5;
const CHECKINS_PER_PROJECT_MIN = 5;
const CHECKINS_PER_PROJECT_MAX = 15;
const PENDING_REQUESTS = 12;   

const SEED_TAG = "seed.v3";


const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const choice = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => arr.slice().sort(() => Math.random() - 0.5);
const uniqueSample = (arr, n) => shuffle(arr).slice(0, n);

const firstNames = [
  "Aiden","Noah","Olivia","Mia","Liam","Ethan","Ava","Sophia","Mason","Lucas",
  "Amelia","Isabella","Harper","Ella","James","Charlotte","Aria","Layla","Zoe","Leo",
  "Jackson","Emily","Grace","Chloe","Benjamin","Henry","Abigail","Mila","Scarlett","Elijah",
  "Avery","Sofia","Jack","Muhammad","Daniel","Caleb","Ezra","Hannah","Nora","Luna"
];
const lastNames = [
  "Nguyen","Smith","Brown","Naidoo","Khan","Mokoena","Dlamini","Pillay","Botha","van der Merwe",
  "Muller","Novak","Kowalski","Silva","Garcia","Rodríguez","Martin","Dubois","Rossi","Bianchi",
  "Williams","Johnson","Taylor","Jones","Singh","Patel","Koenig","Kumar","Kim","Park"
];
const techs = [
  "react","node","mongodb","express","docker","tailwind","typescript","jest","cicd",
  "graphql","rest","k8s","redis","vite","webpack","jwt","auth","sass","nextjs","vitest",
  "design","ui","ux","testing","git","github","security","api","performance","a11y"
];
const verbs = [
  "implemented","refactored","fixed","documented","polished","designed","tested","improved",
  "migrated","integrated","benchmarked","reviewed","reduced","resolved","optimized"
];
const areas = [
  "authentication","routing","project view","profile edit","search bar","friend requests",
  "activity feed","file downloads","build pipeline","CI","styles","components","API schema",
  "helpers","DAL layer","indexes","seed script","dockerfile","webpack config","tailwind setup"
];
const filesPool = [
  "readme.pdf","requirements.docx","design.png","wireframe.fig","api-spec.yaml",
  "notes.txt","screenshot-1.png","diagram.svg","export.csv","logo.svg"
];


const demoUsers = [
  { username: "demo",   name: "Demo User",    email: "demo@example.com" },
  { username: "mentor", name: "Mentor User",  email: "mentor@example.com" }
];
const DEMO_PASSWORD = "password123"; 


const emailOf = (username) => `${username}@example.com`;


function mustEnv(name) {
  const v = process.env[name];
  if (!v) {
    console.error(`Missing ${name}. Set it via env or .env. Example: MONGODB_URI="mongodb+srv://..."`);
    process.exit(1);
  }
  return v;
}

async function main() {
  const uri = mustEnv("MONGODB_URI");
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(); 

  const Users = db.collection("users");
  const Projects = db.collection("projects");
  const Checkins = db.collection("checkins");
  const FriendReq = db.collection("friendRequests");

  
  console.log("Cleaning old seed data...");
  await Promise.all([
    Users.deleteMany({ seedTag: SEED_TAG }),
    Projects.deleteMany({ seedTag: SEED_TAG }),
    Checkins.deleteMany({ seedTag: SEED_TAG }),
    FriendReq.deleteMany({ seedTag: SEED_TAG }),
  ]);

 
  console.log("Ensuring indexes...");
  await Promise.all([
    Users.createIndex({ username: 1 }, { unique: true }),
    Users.createIndex({ email: 1 }, { unique: true }),
    Users.createIndex({ name: "text", username: "text", email: "text" }),
    Projects.createIndex({ name: "text", description: "text", hashtags: 1 }),
    Projects.createIndex({ ownerId: 1 }),
    Checkins.createIndex({ projectId: 1, createdAt: -1 }),
    Checkins.createIndex({ userId: 1, createdAt: -1 }),
    FriendReq.createIndex({ fromUserId: 1, toUserId: 1 }, { unique: true }),
  ]);

  console.log("Creating demo users...");
  const demoPasswordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const demoDocs = [];
  for (const du of demoUsers) {
    const doc = {
      _id: new ObjectId(),
      username: du.username,
      name: du.name,
      email: du.email,
      bio: "I am a demo account for showcasing the app.",
      passwordHash: demoPasswordHash,
      friends: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      seedTag: SEED_TAG,
    };
    demoDocs.push(doc);
  }


  const insertedDemoIds = [];
  for (const doc of demoDocs) {
    const res = await Users.findOneAndUpdate(
      { username: doc.username },
      { $setOnInsert: doc },
      { upsert: true, returnDocument: "after" }
    );
    insertedDemoIds.push(res.value._id);
  }


  console.log(`Creating ${NUM_USERS} users...`);
  const regularUsers = [];
  for (let i = 0; i < NUM_USERS; i++) {
    const first = choice(firstNames);
    const last = choice(lastNames);
    const username = `${first.toLowerCase()}_${last.toLowerCase()}_${rnd(100, 999)}`;
    regularUsers.push({
      _id: new ObjectId(),
      username,
      name: `${first} ${last}`,
      email: emailOf(username),
      bio: choice([
        "Full-stack student dev.",
        "Loves React + Tailwind.",
        "Node/Express + Mongo enjoyer.",
        "Testing out CodeControl.",
        "Learning Docker and CI/CD.",
      ]),
      passwordHash: demoPasswordHash, 
      friends: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      seedTag: SEED_TAG,
    });
  }

 const bulkUsers = regularUsers.length ? await Users.insertMany(regularUsers, { ordered: false }).catch(() => null) : null;
  const allUsers = [
    ...(await Users.find({ username: { $in: demoUsers.map(u => u.username) } }).toArray()),
    ...(bulkUsers ? regularUsers : await Users.find({ seedTag: SEED_TAG, username: { $not: { $in: demoUsers.map(u => u.username) } } }).toArray())
  ];


  console.log("Linking friendships...");

  for (const u of allUsers) {
    const others = allUsers.filter(x => String(x._id) !== String(u._id));
    const n = rnd(3, 6);
    const picks = uniqueSample(others, n);
    const friendIds = picks.map(p => p._id);
    await Users.updateOne(
      { _id: u._id },
      { $addToSet: { friends: { $each: friendIds } } }
    );

    for (const fId of friendIds) {
      await Users.updateOne({ _id: fId }, { $addToSet: { friends: u._id } });
    }
  }


  console.log(`Creating ${PENDING_REQUESTS} pending friend requests...`);
  for (let i = 0; i < PENDING_REQUESTS; i++) {
    const [from, to] = uniqueSample(allUsers, 2);
    const alreadyFriends = (from.friends || []).some(id => String(id) === String(to._id));
    if (alreadyFriends) continue;
    try {
      await FriendReq.insertOne({
        _id: new ObjectId(),
        fromUserId: from._id,
        toUserId: to._id,
        status: "pending",
        createdAt: new Date(),
        seedTag: SEED_TAG,
      });
    } catch (_) {

    }
  }


  console.log(`Creating ${NUM_PROJECTS} projects...`);
  const projects = [];
  for (let i = 0; i < NUM_PROJECTS; i++) {
    const owner = choice(allUsers);
    const memberPool = allUsers.filter(u => String(u._id) !== String(owner._id));
    const memberCount = rnd(1, MAX_MEMBERS_PER_PROJECT);
    const members = uniqueSample(memberPool, memberCount).map(u => u._id);
    const tags = uniqueSample(techs, rnd(2, 5));

    const proj = {
      _id: new ObjectId(),
      ownerId: owner._id,
      name: `Project ${choice(techs)} ${rnd(100, 999)}`,
      description: `A ${choice(["simple","medium","advanced"])} ${choice(["demo","prototype","MVP","assignment"])} focused on ${choice(areas)}.`,
      hashtags: tags,
      members,
      fileKeys: Math.random() < 0.6 ? uniqueSample(filesPool, rnd(1, 3)) : [],
      createdAt: new Date(Date.now() - rnd(5, 45) * 24 * 3600 * 1000),
      updatedAt: new Date(),
      seedTag: SEED_TAG,
    };
    projects.push(proj);
  }
  await Projects.insertMany(projects);


  console.log("Creating check-ins...");
  const checkins = [];
  for (const proj of projects) {
    const allMembers = [proj.ownerId, ...proj.members];
    const n = rnd(CHECKINS_PER_PROJECT_MIN, CHECKINS_PER_PROJECT_MAX);
    let t = proj.createdAt.getTime();
    for (let i = 0; i < n; i++) {
      t += rnd(6, 48) * 3600 * 1000; // next check-in 6–48h later
      const userId = choice(allMembers);
      const msg = `${choice(verbs)} ${choice(areas)}; ${choice([
        "added tests","improved DX","fixed bug","tuned styles","cleaned up code",
        "updated docs","added endpoint","optimized query","improved loading state"
      ])}.`;
      checkins.push({
        _id: new ObjectId(),
        projectId: proj._id,
        userId,
        message: msg,
        createdAt: new Date(t),
        seedTag: SEED_TAG,
      });
    }
  }
  if (checkins.length) await Checkins.insertMany(checkins);


  const [uCount, pCount, cCount, frCount] = await Promise.all([
    Users.countDocuments({ seedTag: SEED_TAG }),
    Projects.countDocuments({ seedTag: SEED_TAG }),
    Checkins.countDocuments({ seedTag: SEED_TAG }),
    FriendReq.countDocuments({ seedTag: SEED_TAG }),
  ]);

  console.log("-------------------------------------------------");
  console.log("Seed complete!");
  console.log(`Users:         ${uCount} (includes demo accounts)`);
  console.log(`Projects:      ${pCount}`);
  console.log(`Check-ins:     ${cCount}`);
  console.log(`Friend reqs:   ${frCount} (pending)`);
  console.log("Demo logins:");
  console.log(`  username: ${demoUsers[0].username}  password: ${DEMO_PASSWORD}`);
  console.log(`  username: ${demoUsers[1].username}  password: ${DEMO_PASSWORD}`);
  console.log("-------------------------------------------------");

  await client.close();
}

main().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
