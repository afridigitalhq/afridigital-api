import { normalizeEvent } from "../../observability/eventHooks";

export function mapDagEvents(dagNodes = []) {
  return dagNodes.map(n => normalizeEvent({
    id: n.id,
    status: n.status,
    timestamp: Date.now()
  }));
}

export function attachDagStream(socket, callback) {
  socket.on("dag:event", (data) => {
    callback(mapDagEvents(data.nodes || []));
  });
}
