import { getAllCameras } from "../../cameras/CameraRegistry.js";
import { cameraStreamGateway } from "../gateway/stream/CameraStreamGateway.js";

export function bootstrapCameraStreams(){

  const cameras = getAllCameras();

  return cameras.map(camera =>
    cameraStreamGateway.open(camera)
  );

}

console.log("🎥 Camera Stream Bootstrap READY");
