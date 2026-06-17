import { orchestrator } from "../orchestrator/SystemOrchestrator";
import { WSClient } from "../ws/client";
import { applyEvent } from "./store";
import { store } from "./store";

export function initEngine() {
  const ws = new WSClient();
  ws.connect();

  ws.onEvent((event) => {
    orchestrator.dispatch(event);
  });

  orchestrator.register((event) => {
    store.dispatch(applyEvent(event));
  });
}
