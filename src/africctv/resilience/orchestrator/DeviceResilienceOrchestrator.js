import { cameraHealthMonitor } from "../../health/CameraHealthMonitor.js";
import { systemHealthMonitor } from "../health/SystemHealthMonitor.js";
import { faultDetectionEngine } from "../diagnostics/FaultDetectionEngine.js";
import { afriCCTVMonitor } from "../../monitoring/AfriCCTVMonitor.js";


export class DeviceResilienceOrchestrator {

 assess(device){

  return {
   deviceId: device.id,

   health:
    cameraHealthMonitor.check
     ? cameraHealthMonitor.check(device)
     : null,

   system:
    systemHealthMonitor.check
     ? systemHealthMonitor.check()
     : null,

   diagnostics:
    faultDetectionEngine.inspect
     ? faultDetectionEngine.inspect(device)
     : null,

   monitoring:
    afriCCTVMonitor.observe
     ? afriCCTVMonitor.observe(device)
     : null,

   coordinatedAt: Date.now()
  };

 }


}


export const deviceResilienceOrchestrator =
 new DeviceResilienceOrchestrator();
