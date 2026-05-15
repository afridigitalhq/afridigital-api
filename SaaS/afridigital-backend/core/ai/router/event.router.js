/**
 * 📡 A3.18.12 EVENT ROUTER
 * Connects event bus → orchestrator
 */

const { handleEvent } = require("../orchestrator/ai.orchestrator");

function attachRouter(bus) {

  bus.subscribe("LEGACY_EVENT_BLOCKED", (event) => {
    handleEvent(event);
  };

}

module.exports = { attachRouter };
