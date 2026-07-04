const streams = new Map();

export function registerStream(stream) {
  streams.set(stream.id, stream);
  return stream;
}

export function unregisterStream(id) {
  return streams.delete(id);
}

export function getStream(id) {
  return streams.get(id) || null;
}

export function getAllStreams() {
  return Array.from(streams.values());
}

export function getActiveStreams() {
  return Array.from(streams.values()).filter(
    (stream) => stream.status === "ACTIVE"
  );
}
