const fs = require("fs");

function trace(event, stage){
  try{
    const line = {
      time: Date.now(),
      stage,
      type: event?.type,
      retries: event?.retries || 0
    };
    fs.appendFileSync("logs/traces/trace.log", JSON.stringify(line)+"\n");
  }catch{}
}

module.exports = { trace };
