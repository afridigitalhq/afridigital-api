import CoreCaseGateway from "../../core/case/gateway/CoreCaseGateway.js";

const AfriCCTVCaseAdapter={open(event){
 return CoreCaseGateway.open(event,"SECURITY");
}};

export default AfriCCTVCaseAdapter;
