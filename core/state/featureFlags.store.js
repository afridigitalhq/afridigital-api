let FLAGS = {
  DAG_RUNTIME: true,
  SIMULATION_ENGINE: false,
  GOD_MODE: false,
  REALTIME_WS_ENGINE: true,
  FORECAST_ENGINE: true
};

function getFlags() {
  return FLAGS;
}

function setFlag(key, value) {
  if (FLAGS.hasOwnProperty(key)) {
    FLAGS[key] = value;
    return { success: true, FLAGS };
  }
  return { success: false, error: "Invalid flag" };
}

module.exports = { getFlags, setFlag };
