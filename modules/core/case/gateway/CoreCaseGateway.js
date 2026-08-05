import CoreCaseRequest from "./CoreCaseRequest.js";
import CoreCaseDecision from "./CoreCaseDecision.js";
import CoreCaseAudit from "./CoreCaseAudit.js";
import CoreCaseManager from "../CoreCaseManager.js";

const CoreCaseGateway={open(input,type){
 const request=CoreCaseRequest.create(input);
 const decision=CoreCaseDecision.open(type);
 const record=CoreCaseManager.create({input,type});
 const audit=CoreCaseAudit.record({request,decision,record});
 return {request,decision,record,audit};
}};

export default CoreCaseGateway;
