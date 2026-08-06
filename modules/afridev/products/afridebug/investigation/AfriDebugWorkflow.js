const AfriDebugWorkflow={
  name:"AfriDebug Investigation Lifecycle",
  version:"3.0",

  stages:[
    "REPOSITORY_INTAKE",
    "DEPENDENCY_ANALYSIS",
    "RUNTIME_INSPECTION",
    "LOG_ANALYSIS",
    "KNOWLEDGE_COMPARISON",
    "AI_PATCH_PLANNING",
    "PATCH_VERIFICATION",
    "EVIDENCE_REPORT",
    "HUMAN_APPROVAL",
    "CLIENT_DELIVERY"
  ],

  describe(){
    return {
      name:this.name,
      version:this.version,
      totalStages:this.stages.length,
      stages:this.stages
    };
  }
};

export default AfriDebugWorkflow;
