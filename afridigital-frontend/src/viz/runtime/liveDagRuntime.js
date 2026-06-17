import { normalizeDagEvent } from "../../core/stream/dagStreamContract";

export function bindLiveDagStream(socket, onNodes) {
  if (!socket) return;

  socket.onmessage = (msg) => {
    try {
      const data = JSON.parse(msg.data);

      if (data.type === "dag:event") {
        const normalized = normalizeDagEvent(data);
        onNodes?.(normalized);
      }

    } catch (e) {}
  };
}
