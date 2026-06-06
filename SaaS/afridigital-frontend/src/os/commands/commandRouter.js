import { bus } from "../bus/eventBus";

export function commandRouter(input) {
  const cmd = input.toLowerCase();

  if (cmd.includes("logs")) {
    bus.emit("ui:open", { window: "logs" });
  }

  if (cmd.includes("health")) {
    bus.emit("ui:open", { window: "system-monitor" });
  }

  if (cmd.includes("flow")) {
    bus.emit("ui:open", { window: "flowgraph" });
  }

  if (cmd.includes("whatsapp")) {
    bus.emit("stream:toggle", { type: "whatsapp" });
  }

  bus.emit("ai:log", { input });
}
