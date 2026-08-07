import fs from "fs";

export class AfriFixRuntimeEventStore {
  constructor(file="modules/afrifix/evidence/runtime/events.json"){
    this.file=file;

    if(!fs.existsSync(file)){
      fs.writeFileSync(file,"[]");
    }
  }

  save(event){
    const events=JSON.parse(fs.readFileSync(this.file,"utf8"));
    events.push(event);
    fs.writeFileSync(this.file,JSON.stringify(events,null,2));

    return {
      component:"AfriFix Runtime Event Store",
      status:"SAVED",
      total:events.length,
      eventId:event.eventId,
      file:this.file,
      timestamp:new Date().toISOString()
    };
  }

  load(){
    return JSON.parse(fs.readFileSync(this.file,"utf8"));
  }

  byExecution(executionId){
    return this.load().filter(e=>e.executionId===executionId);
  }
}
