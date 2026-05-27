const { snapshot } = require("./v8Observe");

function health(){
  const s = snapshot();

  return {
    status: s.errors > 5 ? "DEGRADED" : "HEALTHY",
    metrics: s
  };
}

module.exports = { health };
