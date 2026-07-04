import { socEngine } from "../SOCIntelligenceEngine.js";
import { eventBus } from "../../events/EventBus.js";

export class SOCDashboard {
  constructor() {
    this.liveFeed = [];
    this.subscribers = new Set();

    this.init();
  }

  init() {
    eventBus.on("INCIDENT_CREATED", (incident) => {
      this.liveFeed.unshift(incident);

      if (this.liveFeed.length > 100) {
        this.liveFeed.pop();
      }

      this.broadcast();
    });
  }

  acknowledgeIncident(id) {
    const incident = socEngine.getIncident(id);
    if (!incident) return null;

    incident.status = "ACKNOWLEDGED";
    this.broadcast();

    return incident;
  }

  getFeed() {
    return this.liveFeed;
  }

  getCriticalOnly() {
    return this.liveFeed.filter(i => i.severity === "CRITICAL");
  }

  subscribe(fn) {
    this.subscribers.add(fn);
    return () => this.subscribers.delete(fn);
  }

  broadcast() {
    for (const fn of this.subscribers) {
      fn(this.liveFeed);
    }
  }
}

export const socDashboard = new SOCDashboard();
