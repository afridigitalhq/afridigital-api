import { CCTVWallEngine } from "../wall/CCTVWallEngine.js";
import { getAllStreams } from "../streams/StreamRegistry.js";
import { eventBus } from "../events/EventBus.js";

export class ControlRoomAPI {
  constructor() {
    this.wall = new CCTVWallEngine();
  }

  init() {
    return this.wall.initialize();
  }

  getWallState() {
    return this.wall.getState();
  }

  getStreams() {
    return getAllStreams();
  }

  emitEvent(type, payload) {
    eventBus.emit(type, payload);
  }

  subscribe(event, cb) {
    eventBus.on(event, cb);
  }

  unsubscribe(event, cb) {
    eventBus.off(event, cb);
  }
}

export const controlRoom = new ControlRoomAPI();
