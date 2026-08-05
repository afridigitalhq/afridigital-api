import CoreSecurityPolicy from "./CoreSecurityPolicy.js";
import CoreSecurityRequest from "./CoreSecurityRequest.js";
import CoreSecurityDecision from "./CoreSecurityDecision.js";
import CoreSecurityAudit from "./CoreSecurityAudit.js";
import CoreSecurityRuntime from "../runtime/CoreSecurityRuntime.js";

const CoreSecurityGateway={inspect(input){
 const request=CoreSecurityRequest.create(input);
 const scan=CoreSecurityRuntime.inspect(input);
 const decision=CoreSecurityDecision.approve(input);
 const audit=CoreSecurityAudit.record({request,scan,decision,policy:CoreSecurityPolicy.rules});

 return {request,scan,decision,audit};
}};

export default CoreSecurityGateway;
