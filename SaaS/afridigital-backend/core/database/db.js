const { assertApiVersion } = require("../runtime/safety/api.guard");
const fs = require('fs');
const path = require('path');

function read(file) {
  const p = path.join(__dirname, file);

  if (!fs.existsSync(p)) return [];

  return JSON.parse(fs.readFileSync(p));
}

function write(file, data) {
  const p = path.join(__dirname, file);
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

module.exports = { read, write };
