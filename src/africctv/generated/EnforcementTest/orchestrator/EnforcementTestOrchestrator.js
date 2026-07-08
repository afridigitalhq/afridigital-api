class EnforcementTestOrchestrator {

 coordinate(event){

  return {
   module: "EnforcementTest",
   event,
   coordinatedAt: Date.now()
  };

 }

}

export const EnforcementTestOrchestrator =
 new EnforcementTestOrchestrator();
