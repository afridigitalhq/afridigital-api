export class EvidenceRepository {

  constructor(){
    this.events=[];
  }

  save(event){
    this.events.push(event);
    return event;
  }

  findAll(){
    return this.events;
  }

}

export const evidenceRepository =
new EvidenceRepository();

console.log("🗂 Evidence Repository READY");
