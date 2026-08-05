import CoreSecurityPolicy from "./CoreSecurityPolicy.js";
import CoreSecurityRequest from "./CoreSecurityRequest.js";
import CoreSecurityDecision from "./CoreSecurityDecision.js";
import CoreSecurityAudit from "./CoreSecurityAudit.js";

const CoreSecurityGateway={inspect(input){
 const request=CoreSecurityRequest.create(input);
 const decision=CoreSecurityDecision.approve(input);
 const audit=CoreSecurityAudit.record({request,decision,policy:CoreSecurityPolicy.rules});
 return {request,decision,audit};
}};

export default CoreSecurityGateway;
