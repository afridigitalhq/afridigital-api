const CoreOrchestrationStageManager={
 advance(orchestration,stage){
  orchestration.current=stage;
  return orchestration;
 }
};

export default CoreOrchestrationStageManager;
