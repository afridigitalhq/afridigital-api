import fs from "fs";
import path from "path";

export class AfriDeliveryGateway {

  constructor(){
    this.base =
      "modules/afrinucchain/.data/delivery";

    fs.mkdirSync(this.base,{recursive:true});
  }

  save(packageData){

    const file =
      path.join(
        this.base,
        `${packageData.workspace.id}.json`
      );

    fs.writeFileSync(
      file,
      JSON.stringify(packageData,null,2)
    );

    return {
      component:"AfriNuc Delivery Gateway",
      status:"SAVED",
      workspace:
        packageData.workspace.id,
      approval:
        packageData.approval.status,
      file,
      savedAt:new Date().toISOString()
    };
  }

  load(workspaceId){

    const file =
      path.join(
        this.base,
        `${workspaceId}.json`
      );

    return JSON.parse(
      fs.readFileSync(file,"utf8")
    );
  }
}
