const {
  listExecutions,
  loadExecution
} = require('./persist/store');

const {
  updateExecution
} = require('./store');

function recoverRunningExecutions() {
  const execIds = listExecutions();

  let recovered = 0;

  for (const id of execIds) {
    const exec = loadExecution(id);

    if (!exec) continue;

    // only recover incomplete ones
    if (exec.status !== "completed") {
      updateExecution(id, {
        status: "recovered"
      });

      recovered++;
    }
  }

  console.log(`♻️ Recovered ${recovered} executions`);
}

module.exports = {
  recoverRunningExecutions
};
