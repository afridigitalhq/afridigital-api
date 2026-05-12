const { assertApiVersion } = require("../runtime/safety/api.guard");
const fs = require("fs");
const FILE = "./core/storage/messages.json";

function load() {
  try {
    return JSON.parse(fs.readFileSync(FILE));
  } catch {
    return [];
  }
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

module.exports = { load, save };
