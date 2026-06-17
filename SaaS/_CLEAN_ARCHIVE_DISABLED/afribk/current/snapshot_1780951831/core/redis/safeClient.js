const { createClient } = require("redis");

function createSafeClient(){
  if(!process.env.REDIS_URL){
    console.log("⚠️ Redis disabled (no REDIS_URL)");
    return null;
  }

  const client = createClient({ url: process.env.REDIS_URL });

  client.on("error", (e) => {
    console.log("Redis:", e.message);
  });

  client.connect().catch(() => {});
  return client;
}

module.exports = { createSafeClient };
