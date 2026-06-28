const { exec } = require("child_process");

let lastGoodDeploy = null;

function markHealthy(version) {
  lastGoodDeploy = version;
}

function rollback() {
  if (!lastGoodDeploy) return;

  KERNEL_BLOCKED_EXEC(`git checkout ${lastGoodDeploy} && bash DevOps/deploy.sh`);
}

function onDeployFailure() {
  console.log("CI FAILURE → rolling back");
  rollback();
}

module.exports = {
  markHealthy,
  rollback,
  onDeployFailure
};
