class CommandCenterTestOrchestrator {

 coordinate(event){

  return {
   module: "CommandCenterTest",
   event,
   coordinatedAt: Date.now()
  };

 }

}

export const CommandCenterTestOrchestrator =
 new CommandCenterTestOrchestrator();
