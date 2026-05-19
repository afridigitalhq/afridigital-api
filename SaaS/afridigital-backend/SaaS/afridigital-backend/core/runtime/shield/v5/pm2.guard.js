const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { validateJS } = require("../v4/ast.validator");
const { latestSnapshot, saveSnapshot } = require("../v4/vault");

const FILE = path.join(__dirname, "../../afri.queue.engine.cjs");

function rollback() {
  const snap = latestSnapshot();
  if (snap?.content) {
    fs.writeFileSync(FILE, snap.content);
    console.log("🔁 ROLLBACK EXECUTED");
  }
}

function commitSnapshot() {
  const content = fs.readFileSync(FILE, "utf8");
  saveSnapshot(FILE, content);
}

function validate() {
  return validateJS(FILE);
}

function restartPM2() {
  spawnSync("pm2", ["restart", "afridigital", "--update-env"], {
    stdio: "inherit"
  });
}

(function main() {
  console.log("🧠 SHIELD v5 PRE-DEPLOY CHECK");

  if (!validate()) {
    console.log("🚨 DEPLOY BLOCKED - INVALID STATE");
    rollback();
    restartPM2();
    return;
  }

  commitSnapshot();
  console.log("✅ DEPLOY APPROVED");

  restartPM2();
})();
