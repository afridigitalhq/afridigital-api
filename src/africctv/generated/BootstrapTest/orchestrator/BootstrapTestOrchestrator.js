class BootstrapTestOrchestrator {

 coordinate(event){

  return {
   module: "BootstrapTest",
   event,
   coordinatedAt: Date.now()
  };

 }

}

export const BootstrapTestOrchestrator =
 new BootstrapTestOrchestrator();
