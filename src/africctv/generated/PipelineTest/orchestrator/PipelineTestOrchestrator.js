class PipelineTestOrchestrator {

 coordinate(event){

  return {
   module: "PipelineTest",
   event,
   coordinatedAt: Date.now()
  };

 }

}

export const PipelineTestOrchestrator =
 new PipelineTestOrchestrator();
