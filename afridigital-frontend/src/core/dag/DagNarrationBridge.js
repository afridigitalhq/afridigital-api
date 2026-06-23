import { consciousnessBus } from "../consciousness/ConsciousEventBus";

export function narrateDagEvent(event) {
  if (!event) return;

  const msg =
    event.type === "node_update"
      ? "DAG node is propagating state changes"
      : event.type === "edge_update"
      ? "Graph connection dynamics updated"
      : "System graph state changed";

  consciousnessBus.emit({
    type: "NARRATION",
    payload: msg
  });
}
