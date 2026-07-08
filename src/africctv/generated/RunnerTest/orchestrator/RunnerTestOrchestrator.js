class RunnerTestOrchestrator {

 coordinate(event){

  return {
   module: "RunnerTest",
   event,
   coordinatedAt: Date.now()
  };

 }

}

export const RunnerTestOrchestrator =
 new RunnerTestOrchestrator();
