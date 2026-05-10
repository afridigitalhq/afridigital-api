const fs = require("fs");
const path = require("path");

const dir = "./modules";

function exists(m){
  return fs.existsSync(path.join(dir, m));
}

const modules = [
  "memory-stream",
  "event-sync",
  "memory-distributed",
  "ai-engine",
  "payments",
  "wallet",
  "cost-ai",
  "contract",
  "persona",
  "whatsapp"
];

for (const m of modules){
  if (exists(m)) {
    console.log(`✅ ${m} OK`);
  } else if (exists("_" + m)) {
    console.log(`⚠️ ${m} DISABLED`);
  } else {
    console.log(`❌ ${m} MISSING`);
  }
}
