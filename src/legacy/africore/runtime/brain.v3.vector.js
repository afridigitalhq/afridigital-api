const Redis = require("redis");
const crypto = require("crypto");

const client = Redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

const VEC_KEY = "afri:brain:vectors:";

// simple hash-based pseudo-embedding (upgrade to OpenAI embeddings later)
function embed(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

async function storeVector(user, text) {
  const vector = embed(text);

  await client.hSet(VEC_KEY + user, {
    [Date.now()]: JSON.stringify({ text, vector })
  });
}

async function searchSimilar(user, query) {
  const q = embed(query);
  const all = await client.hGetAll(VEC_KEY + user);

  const results = [];

  for (const [ts, data] of Object.entries(all)) {
    const item = JSON.parse(data);

    if (item.vector.slice(0, 6) === q.slice(0, 6)) {
      results.push(item.text);
    }
  }

  return results.slice(0, 5);
}

module.exports = { storeVector, searchSimilar };
