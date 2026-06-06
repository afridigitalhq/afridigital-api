const { getGlobalState } = require("./global.economy");
const { optimizeEconomy } = require("./optimizer.engine");
const bus = require('../eventbus');

function runSimulationCycle() {

  const state = getGlobalState();

  const recommendations = optimizeEconomy(state);

  const simulation = {
    state,
    recommendations,
    timestamp: Date.now()
  };

  bus.emit("SIMULATION_CYCLE", simulation);

  return simulation;
}

module.exports = { runSimulationCycle };
