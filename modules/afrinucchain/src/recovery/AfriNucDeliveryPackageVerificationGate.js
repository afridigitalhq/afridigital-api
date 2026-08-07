import fs from "fs";

export class AfriNucDeliveryPackageVerificationGate {

  constructor(){
    this.component="AfriNuc Delivery Package Verification Gate";
  }

  verify(file){

    const manifest=JSON.parse(
      fs.readFileSync(file,"utf8")
    );

    const integrity={
      packageExists:!!manifest.packageId,
      jobLinked:!!manifest.jobId,
      auditLinked:!!manifest.artifacts.auditEventId,
      certificateLinked:!!manifest.artifacts.certificateId,
      deliveryReady:manifest.status==="READY_FOR_DELIVERY"
    };

    const verified=Object.values(integrity).every(Boolean);

    return {
      component:this.component,
      status:verified?"VERIFIED":"FAILED",
      packageId:manifest.packageId,
      integrity,
      verifiedAt:new Date().toISOString()
    };
  }
}
