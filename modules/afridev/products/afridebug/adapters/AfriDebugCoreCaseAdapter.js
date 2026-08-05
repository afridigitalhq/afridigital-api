import CoreCaseGateway from "../../../../core/case/gateway/CoreCaseGateway.js";

const AfriDebugCoreCaseAdapter={openCase(input){
 return CoreCaseGateway.open(input,"AFRIDEBUG_INVESTIGATION");
}};

export default AfriDebugCoreCaseAdapter;
