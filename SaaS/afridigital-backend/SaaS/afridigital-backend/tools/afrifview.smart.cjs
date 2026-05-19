const fs = require("fs");

const root = process.cwd();

function list(p){ try{return fs.readdirSync(p).sort()}catch{return []} }

const modules = list("./modules");
const active = modules.filter(m=>!m.startsWith("_"));
const disabled = modules.filter(m=>m.startsWith("_"));

console.log("\n🧠 AFRIFVIEW LIVE SYSTEM SNAPSHOT");
console.log("================================");

console.log("\n✅ ACTIVE MODULES");
active.forEach(m=>console.log(" - " + m));

console.log("\n⚠️ DISABLED MODULES");
disabled.forEach(m=>console.log(" - " + m));

console.log("\n📦 SYSTEM HEALTH");
console.log("Modules:", modules.length);
console.log("Active:", active.length);
console.log("Disabled:", disabled.length);

console.log("\n🚀 RENDER READY CHECK");
console.log(fs.existsSync("server.js") ? "server.js OK" : "server.js MISSING");

console.log("\n==============================\n");
