import { customerAccountService } from "../../service/accounts/CustomerAccountService.js";
import { customerPortalBridge } from "../portal/CustomerPortalBridge.js";
import { userNotificationEngine } from "../notifications/UserNotificationEngine.js";
import { cctvSubscription } from "../../enterprise/billing/CCTVSubscription.js";
import { enterpriseTenantControl } from "../../enterprise/tenant/EnterpriseTenantControl.js";
import { cameraMarketplace } from "../../marketplace/CameraMarketplace.js";


export class CustomerEcosystemOrchestrator {

 coordinate(customer){

  return {

   account:
    customerAccountService.manage
     ? customerAccountService.manage(customer)
     : null,

   portal:
    customerPortalBridge.connect
     ? customerPortalBridge.connect(customer)
     : null,

   notifications:
    userNotificationEngine.notify
     ? userNotificationEngine.notify(customer)
     : null,

   subscription:
    cctvSubscription.status
     ? cctvSubscription.status(customer)
     : null,

   tenant:
    enterpriseTenantControl.manage
     ? enterpriseTenantControl.manage(customer)
     : null,

   marketplace:
    cameraMarketplace.discover
     ? cameraMarketplace.discover(customer)
     : null,

   coordinatedAt: Date.now()

  };

 }

}


export const customerEcosystemOrchestrator =
 new CustomerEcosystemOrchestrator();
