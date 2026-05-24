const safeXReadGroup = async (client, group, consumer, stream) => {
  try {
    return await client.xReadGroup(group, consumer, stream, {
      COUNT: 10,
      BLOCK: 5000
    });
  } catch (e) {
    console.log("🧯 STREAM SAFE MODE:", e.message);
    return null;
  }
};

module.exports = { safeXReadGroup };
