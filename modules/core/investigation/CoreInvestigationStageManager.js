const CoreInvestigationStageManager={
 advance(investigation,stage){
  investigation.stages.push(stage);
  investigation.currentStage=stage;
  return investigation;
 }
};

export default CoreInvestigationStageManager;
