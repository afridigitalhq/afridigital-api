import fs from "fs";

export class AfriNucRecoveryDeliveryPackageBuilder {

  constructor(){
    this.component="AfriNuc Recovery Delivery Package Builder";
    this.dir="modules/afrinucchain/.data/recovery-packages";
    fs.mkdirSync(this.dir,{recursive:true});
  }

  build({jobId,batchId,workspaceId,auditEventId,certificateId}){

    const packageId=`delivery-package-${Date.now()}`;

    const manifest={
      packageId,
      component:this.component,
      jobId,
      batchId,
      workspaceId,
      artifacts:{
        auditEventId,
        certificateId
      },
      status:"READY_FOR_DELIVERY",
      createdAt:new Date().toISOString()
    };

    const file=`${this.dir}/${packageId}.json`;

    fs.writeFileSync(
      file,
      JSON.stringify(manifest,null,2)
    );

    return {
      component:this.component,
      status:"PACKAGE_CREATED",
      manifest,
      file
    };
  }
}
