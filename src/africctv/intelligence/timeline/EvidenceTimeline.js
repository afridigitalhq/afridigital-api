export class EvidenceTimeline {

  constructor(){
    this.records=[];
  }

  record(event){

    const evidence={
      id:`evidence-${Date.now()}`,
      cameraId:event.cameraId,
      type:event.type,
      timestamp:event.timestamp
    };

    this.records.push(evidence);
    evidenceRepository.save(evidence);

    return evidence;
  }

  history(){
    return this.records;
  }
}

export const evidenceTimeline = new EvidenceTimeline();
