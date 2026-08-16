import Investigation from "../investigation/AfriDebugInvestigationRuntime.js";
import Evidence from "../evidence/AfriDebugEvidenceVault.js";
import Security from "../security/AfriDebugFinalSecurityDecisionEngine.js";
import Intelligence from "../client/AfriDebugRootCauseAnalysisEngine.js";
import Reporting from "../client/AfriDebugIncidentReportGenerator.js";
import Assistant from "../intelligence/AfriDebugAssistant.js";
import Orchestrator from "../../../../src/afridebug/platform/orchestration/AfriDebugInvestigationOrchestrator.js";

const safe=(module,fallback)=>{try{return module?.health?module.health():fallback;}catch{return fallback;}};

const AfriDebugExecutionPipeline={
execute(request={}){

const assistant =
Assistant.investigate({
  error:
    request.error ||
    request.issue ||
    "No issue supplied"
});
const investigation=safe(Investigation,{service:"AfriDebugInvestigationRuntime",status:"unavailable"});
const evidence=safe(Evidence,{service:"AfriDebugEvidenceVault",status:"unavailable"});
const security=safe(Security,{service:"AfriDebugFinalSecurityDecisionEngine",status:"unavailable"});
const intelligence=safe(Intelligence,{service:"AfriDebugRootCauseAnalysisEngine",status:"unavailable"});
const reporting=safe(Reporting,{service:"AfriDebugIncidentReportGenerator",status:"unavailable"});

let investigationResult=null;

if(request.investigation){

  investigationResult =
    Orchestrator.run(request.investigation);

}

return{
requestId:"PIPE-"+Date.now(),
target:request.target||"unknown",
assistant,
investigation,
evidence,
security,
intelligence,
reporting,
investigationResult,
status:"executed",
executedAt:Date.now(),
executedAtISO:new Date().toISOString()
};
},

health(){
return{
service:"AfriDebugExecutionPipeline",
mode:"production",
stages:5,
status:"healthy"
};
}
};

export default AfriDebugExecutionPipeline;
