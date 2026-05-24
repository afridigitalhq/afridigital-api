const Redis = require("redis");

const client = Redis.createClient({ url: process.env.REDIS_URL });
client.connect().catch(console.error);

const KEY = "afri:brain:tasks";

async function addTask(task) {
  await client.lPush(KEY, JSON.stringify({
    id: Date.now(),
    ...task
  }));
}

async function getTasks() {
  const items = await client.lRange(KEY, 0, 20);
  return items.map(JSON.parse);
}

module.exports = { addTask, getTasks };
