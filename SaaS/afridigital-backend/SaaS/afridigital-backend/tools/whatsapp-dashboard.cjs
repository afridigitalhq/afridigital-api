const fs = require("fs");
const path = require("path");

const dir = "./modules";

function status(m){
  if (fs.existsSync(path.join(dir, m))) return `✅ ${m} OK`;
  if (fs.existsSync(path.join(dir, "_" + m))) return `⚠️ ${m} DISABLED`;
  return `❌ ${m} MISSING`;
}

// dynamically scan everything (no hardcoding)
const all = fs.readdirSync(dir)
  .filter(m => !m.startsWith("."))
  .filter(m => !m.includes("backup"))
  .filter(m => !m.includes(".js") || fs.statSync(path.join(dir, m)).isDirectory());

function run(){
  let out = "📡 WHATSAPP SYSTEM DASHBOARD\n\n";

  for (const m of all){
    out += status(m) + "\n";
  }

  return out;
}

module.exports = { run };
