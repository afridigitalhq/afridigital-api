import { cameraWall } from "./MultiCameraWall.js";

let tick = 0;

export function rotateCameraWall(){

  tick++;

  const layout = cameraWall.rotate();

  return {
    type:"wall",
    action:"rotation",
    tick,
    cameras:layout,
    ts:Date.now()
  };
}

console.log("🎥 Camera Wall Runtime READY");
