const { snapshot } = require("./metrics");
const fs = require("fs");

function systemHealth(){
  const logs = {
    events: fs.existsSync("logs/observe/events.log"),
    execution: fs.existsSync("logs/observe/execution.log")
  };

  return {
    system: snapshot(),
    logs,
    status: logs.events && logs.execution ? "OBSERVABLE" : "PARTIAL"
  };
}

module.exports = { systemHealth };
