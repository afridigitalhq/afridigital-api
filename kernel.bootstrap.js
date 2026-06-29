const { spawn } = require("child_process");

const ALLOWED = {
  deploy: ["bash", ["DevOps/deploy.sh"]],
  rollback: ["bash", ["DevOps/deploy.sh"]],
  status: ["bash", ["scripts/status.sh"]]
};

function validate(action) {
  if (!action || typeof action !== "object") throw new Error("INVALID_ACTION");
  if (!ALLOWED[action.type]) throw new Error("BLOCKED_ACTION");
  return true;
}

function run(action) {
  validate(action);
  const [cmd, args] = ALLOWED[action.type];

  const child = spawn(cmd, args, {
    shell: false,
    env: {
      ...process.env,
      DEPLOY_VERSION: action.version || ""
    }
  });

  child.stdout.on("data", d => console.log(d.toString()));
  child.stderr.on("data", d => console.error(d.toString()));
}

function execute(action) {
  return run(action);
}

module.exports = { execute };
