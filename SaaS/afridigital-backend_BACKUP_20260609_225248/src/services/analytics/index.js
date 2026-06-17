const mongoose = require("mongoose");

async function getStats() {
  const db = mongoose.connection;

  const users = await db.collection("users").countDocuments();
  const messages = await db.collection("whatsapp_events").countDocuments();

  return {
    users,
    messages,
    status: "LIVE_ANALYTICS"
  };
}

module.exports = { getStats };
