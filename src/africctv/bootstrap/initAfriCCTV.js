import { WebSocketGateway } from "./../api/websocket/WebSocketGateway.js";
import { bootstrapMockCameras } from "../runtime/MockCameraBootstrap.js";
import { bootstrapCameraStreams } from "../runtime/CameraStreamBootstrap.js";

export function initAfriCCTV(server){
  console.log("🎥 Starting AfriCCTV Engine (clean isolation mode)...");

  bootstrapMockCameras();
  bootstrapCameraStreams();

  const gateway = new WebSocketGateway(server);
  gateway.start();

  // PURE CCTV OUTPUT ONLY (no event system coupling)
  globalThis.afriCCTVRuntime = {
    status: "active",
    emitFrame: (frame) => {
      // reserved for future camera pipeline only
      return frame;
    }
  };

  console.log("✅ AfriCCTV ACTIVE - STREAM ONLY MODE");
  return gateway;
}
