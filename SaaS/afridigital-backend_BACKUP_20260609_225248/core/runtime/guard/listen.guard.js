const fs = require("fs");

function scanAndWarn(root=".") {
  const { execSync } = require("child_process");
  const out = execSync(`grep -R "listen(" ${root} --exclude-dir=node_modules --exclude-dir=afribk --exclude-dir=.git || true`).toString();
  return out.split("\n").filter(Boolean);
}

module.exports = { scanAndWarn };
