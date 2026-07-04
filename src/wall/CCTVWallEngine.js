import { eventBus } from "../events/EventBus.js";
import { getAllStreams } from "../streams/StreamRegistry.js";

export class CCTVWallEngine {
  constructor() {
    this.tiles = new Map();
    this.layout = { cols: 3, rows: 3 };

    eventBus.on("STREAM_STARTED", (stream) => this.addTile(stream));
    eventBus.on("STREAM_OFFLINE", (stream) => this.removeTile(stream?.id));
    eventBus.on("STREAM_DEGRADED", (stream) => this.updateTile(stream));
  }

  initialize() {
    const streams = getAllStreams();
    streams.forEach((s) => this.addTile(s));
    return this.getState();
  }

  addTile(stream) {
    if (!stream?.id) return;

    this.tiles.set(stream.id, {
      id: stream.id,
      cameraId: stream.cameraId || stream.id,
      status: stream.status || "ACTIVE",
      protocol: stream.protocol || "UNKNOWN",
      lastUpdate: Date.now()
    });
  }

  updateTile(stream) {
    if (!stream?.id) return;

    const existing = this.tiles.get(stream.id);
    if (!existing) return;

    this.tiles.set(stream.id, {
      ...existing,
      ...stream,
      lastUpdate: Date.now()
    });
  }

  removeTile(id) {
    if (!id) return;
    this.tiles.delete(id);
  }

  setLayout(cols, rows) {
    this.layout = { cols, rows };
  }

  getState() {
    return {
      layout: this.layout,
      tiles: Array.from(this.tiles.values())
    };
  }
}
