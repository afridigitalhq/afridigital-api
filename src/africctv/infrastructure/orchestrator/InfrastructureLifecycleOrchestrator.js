import { productionReadiness } from "../../deployment/ProductionReadiness.js";
import { cameraDeploymentRegistry } from "../../deployment/registry/CameraDeploymentRegistry.js";
import { renderRuntime } from "../../deployment/render/RenderRuntime.js";
import { edgeCameraRuntime } from "../../edge/runtime/EdgeCameraRuntime.js";
import { edgeNodeManager } from "../../global/edge/EdgeNodeManager.js";
import { cameraFleetManager } from "../../edge/fleet/CameraFleetManager.js";
import { edgeCloudSyncBridge } from "../../edge/sync/EdgeCloudSyncBridge.js";


class InfrastructureLifecycleOrchestrator {


 coordinate(infrastructure){

  return {

   readiness:
    productionReadiness.check
     ? productionReadiness.check(infrastructure)
     : null,

   deployment:
    cameraDeploymentRegistry.register
     ? cameraDeploymentRegistry.register(infrastructure)
     : null,

   runtime:
    renderRuntime.start
     ? renderRuntime.start(infrastructure)
     : null,

   edge:
    edgeCameraRuntime.execute
     ? edgeCameraRuntime.execute(infrastructure)
     : null,

   nodes:
    edgeNodeManager.manage
     ? edgeNodeManager.manage(infrastructure)
     : null,

   fleet:
    cameraFleetManager.monitor
     ? cameraFleetManager.monitor(infrastructure)
     : null,

   sync:
    edgeCloudSyncBridge.sync
     ? edgeCloudSyncBridge.sync(infrastructure)
     : null,

   coordinatedAt: Date.now()

  };

 }

}


export const infrastructureLifecycleOrchestrator =
 new InfrastructureLifecycleOrchestrator();
