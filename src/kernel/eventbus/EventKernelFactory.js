import { AfriEventBus } from "./AfriEventBus.js";

export function createEventKernel(){
  const bus = new AfriEventBus();

  // SYSTEM LAYER LOGGING ONLY
  bus.on("system:start", () => {
    console.log("🌍 System boot event received");
  });

  bus.on("system:error", (err) => {
    console.log("🚨 SYSTEM ERROR:", err);
  });

  return bus;
}
