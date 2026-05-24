const Redis = require("redis");
const messenger = require("../messenger/whatsapp.client");

const client = Redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

async function addToSegment(segment, user) {
  await client.sAdd(`afri:segment:${segment}`, user);
}

async function runCampaign(segment, message) {
  const users = await client.sMembers(`afri:segment:${segment}`);

  for (const user of users) {
    await messenger.send(user, message);
  }
}

module.exports = { addToSegment, runCampaign };
