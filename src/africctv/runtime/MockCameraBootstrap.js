import { adapterRegistry } from "../adapters/CameraAdapterRegistry.js";

export function bootstrapMockCameras(){

  const adapter = adapterRegistry.get("MOCK");

  if(!adapter){
    throw new Error("MOCK adapter unavailable");
  }

  return adapter.discover();
}

console.log("🎥 Mock Camera Discovery Bootstrap READY");
