import fs from "fs";
import path from "path";

export class AfriNucRecoveryAuditPersistence {

  constructor(){
    this.dir = "modules/afrinucchain/.data/recovery-audit";
    fs.mkdirSync(this.dir,{recursive:true});
  }

  save(event){

    const file = path.join(
      this.dir,
      `${event.eventId}.json`
    );

    fs.writeFileSync(
      file,
      JSON.stringify(event,null,2)
    );

    return {
      component:"AfriNuc Recovery Audit Persistence",
      status:"SAVED",
      eventId:event.eventId,
      file,
      savedAt:new Date().toISOString()
    };
  }

  load(eventId){

    const file = path.join(
      this.dir,
      `${eventId}.json`
    );

    return JSON.parse(
      fs.readFileSync(file,"utf8")
    );
  }

  list(){

    return fs.readdirSync(this.dir)
      .map(file=>JSON.parse(
        fs.readFileSync(
          path.join(this.dir,file),
          "utf8"
        )
      ));
  }
}
