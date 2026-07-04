export class SOCCoordinationLayer {
  constructor({ rca, reasoning, autopilot, threat }) {
    this.rca = rca;
    this.reasoning = reasoning;
    this.autopilot = autopilot;
    this.threat = threat;

    this.routes = {
      CAMERA_OFFLINE: "threat",
      STREAM_FAILURE: "rca",
      SYSTEM_LOAD: "reasoning",
      ALERT: "threat",
      UNKNOWN: "reasoning"
    };
  }

  route(event, payload) {
    const handlerKey = this.routes[event] || "reasoning";

    switch (handlerKey) {
      case "rca":
        return this.rca.analyze(payload);

      case "reasoning":
        return this.reasoning.reason(payload);

      case "threat":
        return this.threat.respond(payload);

      case "autopilot":
        return this.autopilot.execute(payload);

      default:
        return this.reasoning.reason(payload);
    }
  }

  getRoutingTable() {
    return this.routes;
  }

  updateRoute(event, handler) {
    this.routes[event] = handler;
  }
}

export const createCoordinationLayer = (deps) => {
  return new SOCCoordinationLayer(deps);
};
