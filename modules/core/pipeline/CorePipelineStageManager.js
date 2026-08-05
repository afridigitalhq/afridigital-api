const CorePipelineStageManager={
 advance(pipeline,stage){
  pipeline.currentStage=stage;
  return pipeline;
 }
};

export default CorePipelineStageManager;
