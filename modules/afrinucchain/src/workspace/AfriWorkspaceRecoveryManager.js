import fs from "fs";
import path from "path";

export class AfriWorkspaceRecoveryManager {

  constructor(){
    this.base =
      "modules/afrinucchain/.data/workspaces";
  }

  recover(workspaceId){

    const file =
      path.join(
        this.base,
        `${workspaceId}.json`
      );

    if(!fs.existsSync(file)){
      return {
        component:"AfriNuc Workspace Recovery Manager",
        status:"NOT_FOUND",
        workspaceId
      };
    }

    const workspace =
      JSON.parse(
        fs.readFileSync(file,"utf8")
      );

    return {
      component:"AfriNuc Workspace Recovery Manager",
      status:"RECOVERED",
      workspace,
      recoveredAt:new Date().toISOString()
    };
  }
}
