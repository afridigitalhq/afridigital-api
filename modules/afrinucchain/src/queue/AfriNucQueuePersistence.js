import fs from "fs";
import path from "path";

export class AfriNucQueuePersistence {

  constructor(){
    this.base =
      "modules/afrinucchain/.data/queue";

    fs.mkdirSync(this.base,{recursive:true});
  }

  save(queue){

    const file =
      path.join(
        this.base,
        "execution-queue.json"
      );

    fs.writeFileSync(
      file,
      JSON.stringify(queue,null,2)
    );

    return {
      component:"AfriNuc Queue Persistence",
      status:"SAVED",
      file,
      items:queue.length,
      savedAt:new Date().toISOString()
    };
  }

  load(){

    const file =
      path.join(
        this.base,
        "execution-queue.json"
      );

    if(!fs.existsSync(file)){
      return {
        component:"AfriNuc Queue Persistence",
        status:"EMPTY"
      };
    }

    return JSON.parse(
      fs.readFileSync(file,"utf8")
    );
  }
}
