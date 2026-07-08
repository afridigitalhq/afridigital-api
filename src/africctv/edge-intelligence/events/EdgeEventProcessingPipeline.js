const events=[];

export class EdgeEventProcessingPipeline{

 process(event){

  events.push({
   ...event,
   processed:true
  });

 }

 list(){

  return events;

 }

}

export const edgeEventProcessingPipeline =
new EdgeEventProcessingPipeline();
