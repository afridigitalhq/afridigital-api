import fs from "fs";
import path from "path";

export class AfriWorkspacePersistence {

  constructor(){
    this.base =
      "modules/afrinucchain/.data/workspaces";

    fs.mkdirSync(this.base,{recursive:true});
  }

  save(workspace){

    const file =
      path.join(
        this.base,
        `${workspace.workspaceId}.json`
      );

    fs.writeFileSync(
      file,
      JSON.stringify(workspace,null,2)
    );

    return {
      component:"AfriNuc Workspace Persistence",
      status:"SAVED",
      workspaceId:workspace.workspaceId,
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
