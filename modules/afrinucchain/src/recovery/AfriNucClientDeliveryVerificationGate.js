import fs from "fs";

export class AfriNucClientDeliveryVerificationGate {

  constructor(){
    this.component="AfriNuc Client Delivery Verification Gate";
  }

  verify(file){

    const delivery=JSON.parse(
      fs.readFileSync(file,"utf8")
    );

    const integrity={
      deliveryExists:!!delivery.deliveryId,
      packageLinked:!!delivery.packageId,
      jobLinked:!!delivery.jobId,
      workspaceLinked:!!delivery.workspaceId,
      completed:delivery.status==="HANDOFF_COMPLETED"
    };

    const verified=Object.values(integrity).every(Boolean);

    return {
      component:this.component,
      status:verified?"VERIFIED":"FAILED",
      deliveryId:delivery.deliveryId,
      integrity,
      verifiedAt:new Date().toISOString()
    };
  }
}
