import CoreSecurityGateway from "../../core/security/gateway/CoreSecurityGateway.js";

const AfriSecurityCoreAdapter={
 inspect(target){
  return CoreSecurityGateway.inspect(target);
 }
};

export default AfriSecurityCoreAdapter;
