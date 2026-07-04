import { eventBus } from "../../events/EventBus.js";

export class AutoClipEngine {
  constructor() {
    this.queue = [];
    this.active = true;

    this.init();
  }

  init() {
    eventBus.on("INCIDENT_CREATED", (incident) => {
      this.queue.push(this.createClipTask(incident));
    });
  }

  createClipTask(incident) {
    return {
      id: `clip-${incident.id}`,
      cameraId: incident.cameraId,
      severity: incident.severity,
      startTime: Date.now() - 10000,
      endTime: Date.now() + 10000,
      status: "PENDING"
    };
  }

  processQueue() {
    return this.queue.map((task) => {
      task.status = "GENERATED";
      task.file = `${task.id}.mp4`;
      return task;
    });
  }

  getQueue() {
    return this.queue;
  }
}

export const autoClipEngine = new AutoClipEngine();
