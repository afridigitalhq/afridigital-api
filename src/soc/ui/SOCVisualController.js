import { socDashboard } from "../dashboard/SOCDashboard.js";

export class SOCVisualController {
  constructor() {
    this.activeFocus = null;
    this.wallState = new Map();

    this.init();
  }

  init() {
    socDashboard.subscribe((feed) => {
      this.updateWall(feed);
    });
  }

  updateWall(feed) {
    for (const incident of feed) {
      const cameraId = incident.cameraId;
      if (!cameraId) continue;

      this.wallState.set(cameraId, {
        severity: incident.severity,
        active: true,
        lastIncident: incident.id,
        type: incident.type
      });
    }
  }

  getWall() {
    return Array.from(this.wallState.entries()).map(([cameraId, state]) => ({
      cameraId,
      ...state
    }));
  }

  focusCamera(cameraId) {
    this.activeFocus = cameraId;
    return this.wallState.get(cameraId) || null;
  }

  getActiveFocus() {
    return this.activeFocus;
  }
}

export const socVisualController = new SOCVisualController();
