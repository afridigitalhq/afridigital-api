import Investigation from "../../platform/investigation/AfriDebugInvestigationRuntime.js";
import Evidence from "../../platform/evidence/AfriDebugEvidenceVault.js";
import Security from "../../platform/security/AfriDebugFinalSecurityDecisionEngine.js";
import Intelligence from "../../platform/intelligence/AfriDebugRootCauseAnalysisEngine.js";
import Reporting from "../../platform/reporting/AfriDebugIncidentReportGenerator.js";

const safe=(module,fallback)=>{try{return module?.health?module.health():fallback;}catch{return fallback;}};

const AfriDebugExecutionPipeline={
execute(request={}){
const investigation=safe(Investigation,{service:"AfriDebugInvestigationRuntime",status:"unavailable"});
const evidence=safe(Evidence,{service:"AfriDebugEvidenceVault",status:"unavailable"});
const security=safe(Security,{service:"AfriDebugFinalSecurityDecisionEngine",status:"unavailable"});
const intelligence=safe(Intelligence,{service:"AfriDebugRootCauseAnalysisEngine",status:"unavailable"});
const reporting=safe(Reporting,{service:"AfriDebugIncidentReportGenerator",status:"unavailable"});

return{
requestId:"PIPE-"+Date.now(),
target:request.target||"unknown",
investigation,
evidence,
security,
intelligence,
reporting,
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
