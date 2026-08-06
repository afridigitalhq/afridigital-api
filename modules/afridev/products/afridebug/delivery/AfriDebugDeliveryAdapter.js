import CoreReportGenerator from "../../../../core/delivery/CoreReportGenerator.js";
import CoreDeliveryManager from "../../../../core/delivery/CoreDeliveryManager.js";

const AfriDebugDeliveryAdapter={
 generate(repository){
  return CoreReportGenerator.generate({service:"AfriDebug",repository});
 },
 deliver(report,target={}){
  return CoreDeliveryManager.deliver(report,target);
 }
};

export default AfriDebugDeliveryAdapter;
