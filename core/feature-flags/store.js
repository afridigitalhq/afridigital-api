const { broadcastFlags } = require("../realtime/flags.stream");
const { assertMutable } = require("./deploy.guard");

const FLAGS = {
  DAG_RUNTIME: true,
  SIMULATION_ENGINE: false,
  GOD_MODE: false,
  REALTIME_WS_ENGINE: true,
  NARRATOR_STREAM: true,
  FORECAST_ENGINE: true
};

function getFlags() {
  return FLAGS;
}

function setFlag(key, value) {
  assertMutable();

  if (!(key in FLAGS)) {
    throw new Error("Unknown flag: " + key);
  }

  FLAGS[key] = value;

  try {
    broadcastFlags(FLAGS);
  } catch (e) {}

  return FLAGS;
}

function validateProductionSafety() {
  const unsafe = [];

  if (FLAGS.GOD_MODE) unsafe.push("GOD_MODE enabled");
  if (FLAGS.SIMULATION_ENGINE) unsafe.push("SIMULATION_ENGINE enabled");

  return {
    safe: unsafe.length === 0,
    issues: unsafe
  };
}

module.exports = { getFlags, setFlag, validateProductionSafety };

const { notifyCI } = require("../notify/ci.notify");

function validateProductionSafety() {
  const unsafe = [];

  if (FLAGS.GOD_MODE) unsafe.push("GOD_MODE enabled");
  if (FLAGS.SIMULATION_ENGINE) unsafe.push("SIMULATION_ENGINE enabled");

  const result = {
    safe: unsafe.length === 0,
    issues: unsafe
  };

  notifyCI({
    type: "FLAG_VALIDATION",
    status: result.safe ? "SAFE" : "BLOCKED"
  });

  return result;
}

