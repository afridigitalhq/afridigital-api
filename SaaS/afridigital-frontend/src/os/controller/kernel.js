import { bus } from "../bus/eventBus";

export function initKernel() {
  bus.on("ui:open", (payload) => {
    console.log("🪟 OPEN WINDOW:", payload.window);
  });

  bus.on("stream:toggle", (payload) => {
    console.log("📡 STREAM:", payload.type);
  });

  bus.on("ai:log", (data) => {
    console.log("🧠 AI EVENT:", data.input);
  });
}
