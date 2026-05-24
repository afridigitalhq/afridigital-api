const Redis = require("redis");

const client = Redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

const RAW = "afri:brain:raw:";
const SUMMARY = "afri:brain:summary:";
const PROFILE = "afri:brain:profile:";

// store raw interaction
async function storeMessage(user, msg) {
  await client.lPush(RAW + user, JSON.stringify({
    msg,
    ts: Date.now()
  }));

  await client.lTrim(RAW + user, 0, 80);
}

// store compressed memory
async function storeSummary(user, summary) {
  await client.set(SUMMARY + user, summary);
}

// retrieve raw + summary
async function recall(user) {
  const raw = await client.lRange(RAW + user, 0, 50);
  const summary = await client.get(SUMMARY + user);

  return {
    summary: summary || "",
    messages: raw.map(x => JSON.parse(x)).reverse()
  };
}

// personality profile (persistent traits)
async function getProfile(user) {
  const p = await client.get(PROFILE + user);
  return p ? JSON.parse(p) : {
    intent: [],
    tone: "neutral",
    tags: []
  };
}

async function updateProfile(user, patch) {
  const current = await getProfile(user);
  const updated = { ...current, ...patch };
  await client.set(PROFILE + user, JSON.stringify(updated));
}

module.exports = {
  storeMessage,
  storeSummary,
  recall,
  getProfile,
  updateProfile
};
