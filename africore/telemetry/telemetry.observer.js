const Redis = require("redis");

const STREAM = "afri:telemetry:stream";
const GROUP = "afri-group-v2";
const CONSUMER = "telemetry-1";

const client = Redis.createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379"
});

client.connect()
  .then(() => console.log("🛰️ Telemetry Observer ACTIVE"))
  .catch(e => console.log("Telemetry Redis Error:", e.message));

async function start() {

  try {

    await client.xGroupCreate(
      STREAM,
      GROUP,
      "$",
      { MKSTREAM: true }
    );

  } catch (e) {

    if (!e.message.includes("BUSYGROUP")) {
      console.log("GROUP INIT ERROR:", e.message);
    }

  }

  while (true) {

    try {

      const data = await client.xReadGroup(
        GROUP,
        CONSUMER,
        [
          {
            key: STREAM,
            id: ">"
          }
        ],
        {
          COUNT: 10,
          BLOCK: 5000
        }
      );

      if (!data) continue;

      for (const stream of data) {

        for (const msg of stream.messages) {

          console.log("📊 TELEMETRY:", {
            id: msg.id,
            type: msg.message.type,
            payload: JSON.parse(
              msg.message.payload || "{}"
            )
          });

          await client.xAck(
            STREAM,
            GROUP,
            msg.id
          );

        }

      }

    } catch (e) {

      console.log(
        "TELEMETRY OBSERVER ERROR:",
        e.message
      );

    }

  }

}

module.exports = { start };
