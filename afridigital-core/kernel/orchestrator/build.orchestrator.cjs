const { execSync } = require("child_process");
const path = require("path");

const FRONTEND = path.resolve(__dirname, "../../../SaaS/afridigital-frontend");

function run(cmd, cwd) {
  execSync(cmd, { stdio: "inherit", cwd });
}

console.log("\n🚀 ORCHESTRATOR V9 CLEAN START\n");

run("npm install && npm run build", FRONTEND);
run("node enforce-ui.cjs", FRONTEND);

console.log("\n✅ BUILD COMPLETE\n");
