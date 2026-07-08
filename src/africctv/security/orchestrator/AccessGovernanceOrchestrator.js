import { cameraAccessControl } from "../CameraAccessControl.js";
import { roleAccessControl } from "../../governance/access/RoleAccessControl.js";
import { identityAccessManager } from "../../governance/identity/IdentityAccessManager.js";
import { accessPolicyEngine } from "../policy/AccessPolicyEngine.js";
import { tenantIsolation } from "../tenant/TenantIsolation.js";


export class AccessGovernanceOrchestrator {


 evaluate(request){

  return {

   identity:
    identityAccessManager.get
     ? identityAccessManager.get(request.identity)
     : null,

   role:
    roleAccessControl.check
     ? roleAccessControl.check(request.role)
     : null,

   policy:
    accessPolicyEngine.evaluate
     ? accessPolicyEngine.evaluate(request)
     : null,

   camera:
    cameraAccessControl.authorize
     ? cameraAccessControl.authorize(request)
     : null,

   tenant:
    tenantIsolation.verify
     ? tenantIsolation.verify(request.tenant)
     : null,

   evaluatedAt: Date.now()

  };

 }


}


export const accessGovernanceOrchestrator =
 new AccessGovernanceOrchestrator();
