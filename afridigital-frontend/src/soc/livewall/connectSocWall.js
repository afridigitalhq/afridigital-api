import { buildSocLiveWall } from "./socLiveWallEngine";

export function connectSocWall(controlPlaneOutput) {
  return buildSocLiveWall(controlPlaneOutput);
}
