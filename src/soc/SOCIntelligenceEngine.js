import { eventBus } from "../events/EventBus.js";
import { evidencePipeline } from "../evidence/EvidencePipeline.js";

export class SOCIntelligenceEngine {
  constructor() {
    this.incidents = new Map();
  }

  analyzeEvent(event) {
    if (!event) return null;

    const severity = this.computeSeverity(event);

    const incident = {
      id: `inc-${Date.now()}`,
      type: event.type || "UNKNOWN",
      cameraId: event.cameraId || null,
      severity,
      timestamp: Date.now(),
      raw: event
    };

    this.incidents.set(incident.id, incident);

    eventBus.emit("INCIDENT_CREATED", incident);

    // auto evidence trigger
    if (severity === "HIGH" || severity === "CRITICAL") {
      evidencePipeline.createIncidentBundle(incident);
    }

    return incident;
  }

  computeSeverity(event) {
    if (event?.type === "MOTION") return "MEDIUM";
    if (event?.type === "TAMPER") return "HIGH";
    if (event?.type === "INTRUSION") return "CRITICAL";
    return "LOW";
  }

  getIncident(id) {
    return this.incidents.get(id) || null;
  }

  getAllIncidents() {
    return Array.from(this.incidents.values());
  }
}

export const socEngine = new SOCIntelligenceEngine();
