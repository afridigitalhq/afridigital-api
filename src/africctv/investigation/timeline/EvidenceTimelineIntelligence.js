const timeline=[];

export class EvidenceTimelineIntelligence{

 add(event){

  timeline.push(event);

 }

 list(){

  return timeline;

 }

}

export const evidenceTimelineIntelligence =
new EvidenceTimelineIntelligence();
