/**
 * 🧠 SINGLE RUNTIME ENFORCEMENT
 * Prevents multiple execution entrypoints
 */

module.exports = {
  ENTRYPOINT: "server.js",
  MODE: "CONTROL_TOWER_ONLY",
  AFRISCAN_MODE: "READ_ONLY"
};
