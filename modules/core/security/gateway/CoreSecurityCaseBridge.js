import CoreCaseGateway from "../../case/gateway/CoreCaseGateway.js";

const CoreSecurityCaseBridge={create(input){
 return CoreCaseGateway.open(input,"SECURITY");
}};

export default CoreSecurityCaseBridge;
