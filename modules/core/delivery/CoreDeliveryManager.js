const CoreDeliveryManager={
 deliver(report,target={}){
  return {report,target,status:"DELIVERED"};
 }
};

export default CoreDeliveryManager;
