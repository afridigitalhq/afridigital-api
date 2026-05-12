const { assertApiVersion } = require("../runtime/safety/api.guard");
const MODE = process.env.EXECUTION_MODE || "development";

function isProduction() {
  return MODE === "production";
}

function assertNoSimulation(code, location) {
  const banned = [
    "simulate",
    "mock",
    "dummy",
    "fake",
    "sandbox",
  ];

  if (isProduction()) {
    const text = code.toString().toLowerCase();

    for (const b of banned) {
      if (text.includes(b)) {
        throw new Error(
          `❌ SIMULATION BLOCKED IN PRODUCTION at ${location}: ${b}`
        );
      }
    }
  }
}

module.exports = {
  MODE,
  isProduction,
  assertNoSimulation,
};
