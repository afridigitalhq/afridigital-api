const fs = require("fs");

function write(file, data){
  fs.mkdirSync("logs/observe", { recursive: true });
  fs.appendFileSync(file, data + "\n");
}

function traceEvent(event){
  const line = JSON.stringify({
    ts: Date.now(),
    type: event.type,
    from: event.from || null,
    payload: event.payload || null
  });

  write("logs/observe/events.log", line);
}

function traceExecution(step, meta = {}){
  const line = JSON.stringify({
    ts: Date.now(),
    step,
    meta
  });

  write("logs/observe/execution.log", line);
}

module.exports = { traceEvent, traceExecution };
