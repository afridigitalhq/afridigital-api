const mongoose = require("mongoose");

let connected = false;

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log("⚠️ DB NOT CONFIGURED — RUNNING IN DEGRADE MODE");
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });

    connected = true;
    console.log("🟢 MongoDB CONNECTED");
  } catch (err) {
    connected = false;
    console.log("⚠️ MongoDB FAILED — DEGRADE MODE ACTIVE");
  }
}

function isDBConnected() {
  return connected;
}

module.exports = { connectDB, isDBConnected };
