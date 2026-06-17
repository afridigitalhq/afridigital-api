const { run } = require("./core/executor/safeRunner");
const { applyPatch } = require("./core/executor/patchRunner");

const cmd = process.argv[2];

switch(cmd){

  case "start":
    run("node core/bootstrap.js");
    break;

  case "verify":
    run("node afri-verify.js");
    break;

  case "logs":
    run("tail -n 50 logs/afri-audit.log || true");
    break;

  default:
    console.log(`
AFRI V7.5 CLI
-------------
start   -> boot system
verify  -> run system check
logs    -> show logs
    `);
}
