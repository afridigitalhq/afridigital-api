import { getAllStreams } from "./StreamRegistry.js";

export class StreamGateway {
  constructor() {
    this.sessions = new Map();
  }

  startSession(camera) {
    const sessionId = `${camera.id}-${Date.now()}`;

    const session = {
      id: sessionId,
      cameraId: camera.id,
      status: "LIVE",
      protocol: camera.adapter || "unknown",
      stream: camera.streams || {},
      startedAt: Date.now()
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  stopSession(sessionId) {
    return this.sessions.delete(sessionId);
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId) || null;
  }

  getAllSessions() {
    return Array.from(this.sessions.values());
  }

  getRegistryStreams() {
    return getAllStreams();
  }
}
