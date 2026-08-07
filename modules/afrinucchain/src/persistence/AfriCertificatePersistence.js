import fs from "fs";
import path from "path";

export class AfriCertificatePersistence {
  constructor(){
    this.base="modules/afrinucchain/.data/certificates";
    fs.mkdirSync(this.base,{recursive:true});
  }

  save(batchId,certificate){
    const file=path.join(this.base,`${batchId}.json`);

    const record={
      batchId,
      certificate,
      savedAt:new Date().toISOString()
    };

    fs.writeFileSync(
      file,
      JSON.stringify(record,null,2)
    );

    return {
      component:"AfriNuc Certificate Persistence",
      status:"SAVED",
      batchId,
      file
    };
  }

  load(batchId){
    const file=path.join(this.base,`${batchId}.json`);

    if(!fs.existsSync(file)){
      return {
        component:"AfriNuc Certificate Persistence",
        status:"NOT_FOUND",
        batchId
      };
    }

    return JSON.parse(fs.readFileSync(file,"utf-8"));
  }
}
