const Redis = require("redis");

async function ensureGroup(client, stream, group) {
  try {
    await client.xGroupCreate(stream, group, "$", { MKSTREAM: true });
  } catch (e) {
    if (!e.message.includes("BUSYGROUP")) {
      console.log("🧯 GROUP INIT ERROR:", e.message);
    }
  }
}

module.exports = { ensureGroup };
