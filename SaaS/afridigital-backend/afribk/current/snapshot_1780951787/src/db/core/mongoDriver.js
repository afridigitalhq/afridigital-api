const mongoose = require("mongoose");

async function connect(uri) {
  await mongoose.connect(uri);
  console.log("🟢 Mongo Driver Connected");
}

async function find(model, query) {
  return model.find(query);
}

async function insert(model, data) {
  return model.create(data);
}

module.exports = { connect, find, insert };
