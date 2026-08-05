const AfriDebugLifecycleEngine={
  stages:[
    "SECURITY_SCAN",
    "EVIDENCE_INTAKE",
    "CASE_CREATION",
    "BEFORE_SNAPSHOT",
    "INVESTIGATION",
    "FIX",
    "TEST",
    "APPROVAL",
    "DEPLOY",
    "AFTER_SNAPSHOT",
    "REPORT"
  ],

  start(){
    return {status:"LIFECYCLE_STARTED",stages:this.stages};
  }
};

export default AfriDebugLifecycleEngine;
