const { GROUP, CONSUMER } = require("./stream.constants");

async function readGroup(client, streamKey) {
  try {
    return await client.xReadGroup(
      GROUP,
      CONSUMER,
      [{ key: streamKey, id: ">" }],
      {
        COUNT: 10,
        BLOCK: 5000
      }
    );
  } catch (e) {
    console.log("🧯 STREAM FAIL SAFE:", streamKey, e.message);
    return null;
  }
}

module.exports = { readGroup };
