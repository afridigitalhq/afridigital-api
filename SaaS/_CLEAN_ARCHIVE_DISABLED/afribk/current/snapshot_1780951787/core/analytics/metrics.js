const fs = require("fs");

function log(event, status){
  try{
    const line = {
      time: Date.now(),
      type: event.type,
      status
    };

    fs.appendFileSync("logs/metrics/metrics.log", JSON.stringify(line)+"\n");
  }catch{}
}

module.exports = { log };
