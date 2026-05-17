const fs = require("fs");
const path = require("path");

const VAULT_DIR = path.join(__dirname, "../.vault");

function saveSnapshot(file, content) {
  const snap = {
    file,
    content,
    ts: Date.now()
  };

  fs.writeFileSync(
    path.join(VAULT_DIR, `${Date.now()}.json`),
    JSON.stringify(snap, null, 2)
  );
}

function latestSnapshot() {
  const files = fs.readdirSync(VAULT_DIR);
  if (!files.length) return null;

  const latest = files.sort().pop();
  return JSON.parse(fs.readFileSync(path.join(VAULT_DIR, latest)));
}

module.exports = { saveSnapshot, latestSnapshot };
