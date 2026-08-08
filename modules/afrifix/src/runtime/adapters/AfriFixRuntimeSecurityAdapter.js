import CoreSecurityRuntime from "../../../../core/security/runtime/CoreSecurityRuntime.js";
const AfriFixRuntimeSecurityAdapter={inspect(target){return CoreSecurityRuntime.inspect(target);}};
export default AfriFixRuntimeSecurityAdapter;
