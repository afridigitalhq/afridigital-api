import fs from "fs";

export class AfriFixRuntimeEventStore {
  constructor(file="modules/afrifix/evidence/runtime/events.json"){
    this.file=file;
    if(!fs.existsSync(file)) fs.writeFileSync(file,"[]");
  }

  save(event={}){
    const events=JSON.parse(fs.readFileSync(this.file,"utf8"));
    events.push(event);
    fs.writeFileSync(this.file,JSON.stringify(events,null,2));
    return {component:"AfriFix Runtime Event Store",status:"SAVED",total:events.length,eventId:event.eventId,file:this.file,timestamp:new Date().toISOString()};
  }

  publish(type,payload={}){
    const events=JSON.parse(fs.readFileSync(this.file,"utf8"));
    const sequence=events.reduce((max,event)=>Math.max(max,Number(event.sequence)||0),0)+1;
    const event={
      eventId:`evt-${Date.now()}-${sequence}`,
      sequence,
      type,
      executionId:payload.executionId||null,
      module:payload.module||null,
      action:payload.action||null,
      timestamp:new Date().toISOString(),
      payload
    };
    events.push(event);
    fs.writeFileSync(this.file,JSON.stringify(events,null,2));
    return {component:"AfriFix Runtime Event Store",status:"SAVED",total:events.length,event};
  }

  load(){ return JSON.parse(fs.readFileSync(this.file,"utf8")); }

  byExecution(executionId){
    return this.load().filter(event=>event.executionId===executionId);
  }
}
