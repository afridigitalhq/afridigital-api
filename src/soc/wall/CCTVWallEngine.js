import { socVisualController } from "../ui/SOCVisualController.js";

export class CCTVWallEngine {
  constructor() {
    this.grid = [];
    this.layout = { rows: 3, cols: 3 };

    this.init();
  }

  init() {
    this.refresh();
  }

  refresh() {
    const wallData = socVisualController.getWall();

    this.grid = wallData.map((camera) => ({
      id: camera.cameraId,
      status: camera.active ? "LIVE" : "IDLE",
      severity: camera.severity || "LOW",
      lastIncident: camera.lastIncident || null,
      highlight: camera.severity === "CRITICAL"
    }));
  }

  getGrid() {
    this.refresh();
    return this.grid;
  }

  setLayout(rows, cols) {
    this.layout = { rows, cols };
  }

  focusTile(cameraId) {
    return this.grid.find(c => c.id === cameraId) || null;
  }

  getLayout() {
    return this.layout;
  }
}

export const cctvWallEngine = new CCTVWallEngine();
