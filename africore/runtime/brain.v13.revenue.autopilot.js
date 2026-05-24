const Redis = require("redis");

const client = Redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

async function scoreUser(user, intentScore) {
  const value = intentScore * 100;

  await client.zAdd("afri:revenue:scoreboard", {
    score: value,
    value: user
  });

  return value;
}

async function getTopUsers(limit = 10) {
  return await client.zRange("afri:revenue:scoreboard", -limit, -1, {
    REV: true
  });
}

module.exports = { scoreUser, getTopUsers };
