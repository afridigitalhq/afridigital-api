import { customerPortalBridge } from "../../customer/portal/CustomerPortalBridge.js";
import { customerAccountService } from "../../service/accounts/CustomerAccountService.js";
import { cctvSubscription } from "../../enterprise/billing/CCTVSubscription.js";
import { cameraMarketplace } from "../../marketplace/CameraMarketplace.js";
import { enterpriseDashboardBridge } from "../../service/enterprise/EnterpriseDashboardBridge.js";
import { externalIntegrationGateway } from "../../ecosystem/integration/ExternalIntegrationGateway.js";
import { afriControlPlaneConnector } from "../../ecosystem/control/AfriControlPlaneConnector.js";

class PlatformExperienceOrchestrator {

 coordinate(platformRequest){

  return {

   portal:
    customerPortalBridge.connect
     ? customerPortalBridge.connect(platformRequest)
     : null,

   account:
    customerAccountService.manage
     ? customerAccountService.manage(platformRequest)
     : null,

   subscription:
    cctvSubscription.process
     ? cctvSubscription.process(platformRequest)
     : null,

   marketplace:
    cameraMarketplace.handle
     ? cameraMarketplace.handle(platformRequest)
     : null,

   enterprise:
    enterpriseDashboardBridge.sync
     ? enterpriseDashboardBridge.sync(platformRequest)
     : null,

   integration:
    externalIntegrationGateway.route
     ? externalIntegrationGateway.route(platformRequest)
     : null,

   control:
    afriControlPlaneConnector.connect
     ? afriControlPlaneConnector.connect(platformRequest)
     : null,

   coordinatedAt: Date.now()

  };

 }

}

export const platformExperienceOrchestrator =
 new PlatformExperienceOrchestrator();
