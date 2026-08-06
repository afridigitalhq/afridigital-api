import Bus from "../../events/AfriDebugEventBus.js";

const active = [];

Bus.on("investigation.started", event => {
  active.push({
    id: event.payload.id,
    project: event.payload.project,
    startedAt: event.timestamp,
    status: "RUNNING"
  });
});

const AfriDebugLiveMonitor = {
  active() {
    return active;
  },

  stats() {
    return {
      activeInvestigations: active.length,
      running: active.filter(x => x.status === "RUNNING").length
    };
  }
};

export default AfriDebugLiveMonitor;
