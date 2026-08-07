import fs from "fs";
import path from "path";

export class AfriClientDeliveryDispatcher {

  constructor(){
    this.base =
      "modules/afrinucchain/.data/client-delivery";

    fs.mkdirSync(this.base,{recursive:true});
  }

  dispatch(delivery,approval){

    if(
      !approval ||
      approval.currentStatus !== "READY_FOR_CLIENT_DELIVERY"
    ){
      return {
        component:"AfriNuc Client Delivery Dispatcher",
        status:"REJECTED",
        reason:"Human approval required"
      };
    }

    const record = {
      workspace:delivery.workspace,
      project:delivery.project,
      status:"DELIVERED",
      approval:"HUMAN_APPROVED",
      deliveredAt:new Date().toISOString()
    };

    const file =
      path.join(
        this.base,
        `${delivery.workspace.id}.json`
      );

    fs.writeFileSync(
      file,
      JSON.stringify(record,null,2)
    );

    return {
      component:"AfriNuc Client Delivery Dispatcher",
      status:"DELIVERED",
      file,
      record
    };
  }
}
