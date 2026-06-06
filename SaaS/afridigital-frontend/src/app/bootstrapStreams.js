import { eventBus } from "../core/eventBus";
import { useControlStore } from "../store/useControlStore";

export function bootstrapStreams() {
  const store = useControlStore.getState();

  eventBus.on("log", store.pushLog);
  eventBus.on("whatsapp", store.pushEvent);
  eventBus.on("trace", store.pushTrace);
}
