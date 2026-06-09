const fs = require("fs");

let state = {
  events: 0,
  errors: 0,
  lastEvent: null
};

function trace(event){
  state.events++;
  state.lastEvent = event;
  fs.appendFileSync("logs/observe/events.log", JSON.stringify(event) + "\n");
}

function error(err){
  state.errors++;
  fs.appendFileSync("logs/observe/errors.log", err.message + "\n");
}

function snapshot(){
  return state;
}

module.exports = { trace, error, snapshot };
