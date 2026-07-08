import { registerCamera } from "../../cameras/CameraRegistry.js";

export class MockCameraAdapter {
  name = "MOCK";

  discover() {
    const cameras = [
      {
        id: "mock-001",
        name: "Mock Lobby Camera",
        provider: "MOCK",
        protocol: "WEBRTC",
        status: "LIVE"
      },
      {
        id: "mock-002",
        name: "Mock Entrance Camera",
        provider: "MOCK",
        protocol: "WEBRTC",
        status: "LIVE"
      }
    ];

    cameras.forEach(registerCamera);

    return cameras;
  }

  connect(camera) {
    return {
      cameraId: camera.id,
      transport: "WEBRTC",
      status: "READY"
    };
  }
}
