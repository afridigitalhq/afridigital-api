const { register } = require("./adapter/db");
const mongo = require("./core/mongoDriver");
const mock = require("./core/mockDriver");

async function initDB() {
  try {
    if (process.env.MONGODB_URI) {
      await mongo.connect(process.env.MONGODB_URI);
      register(mongo);
    } else {
      await mock.connect();
      register(mock);
    }

    console.log("🧠 Hybrid DB Layer Initialized");
  } catch (err) {
    console.warn("⚠️ DB init failed, switching to mock:", err.message);
    register(mock);
  }
}

module.exports = { initDB };
