import CoreSecurityGateway from "../../core/security/gateway/CoreSecurityGateway.js";

const AfriCCTVSecurityAdapter={inspect(event){
 return CoreSecurityGateway.inspect(event);
}};

export default AfriCCTVSecurityAdapter;
