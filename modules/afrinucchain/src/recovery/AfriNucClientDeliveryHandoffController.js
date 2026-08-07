import fs from "fs";

export class AfriNucClientDeliveryHandoffController {

  constructor(){
    this.component="AfriNuc Client Delivery Handoff Controller";
    this.dir="modules/afrinucchain/.data/client-delivery";
    fs.mkdirSync(this.dir,{recursive:true});
  }

  handoff({packageId,jobId,batchId,workspaceId,client}){

    const deliveryId=`handoff-${Date.now()}`;

    const record={
      deliveryId,
      component:this.component,
      packageId,
      jobId,
      batchId,
      workspaceId,
      client,
      status:"HANDOFF_COMPLETED",
      deliveredAt:new Date().toISOString()
    };

    const file=`${this.dir}/${deliveryId}.json`;

    fs.writeFileSync(
      file,
      JSON.stringify(record,null,2)
    );

    return {
      component:this.component,
      status:"COMPLETED",
      delivery:record,
      file
    };
  }
}
