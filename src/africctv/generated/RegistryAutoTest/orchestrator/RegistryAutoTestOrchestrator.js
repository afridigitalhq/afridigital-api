class RegistryAutoTestOrchestrator {

 coordinate(event){

  return {
   module: "RegistryAutoTest",
   event,
   coordinatedAt: Date.now()
  };

 }

}

export const RegistryAutoTestOrchestrator =
 new RegistryAutoTestOrchestrator();
