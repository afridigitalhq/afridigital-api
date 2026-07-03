import { eventBus } from "../runtime/events/event.bus.js";

export function initEvents() {
  console.log("📡 Event engine initialized");

  eventBus.on("system:start", () => {
    console.log("⚡ System start event fired");
  });

  eventBus.emit("system:start", { status: "ok" });
}
