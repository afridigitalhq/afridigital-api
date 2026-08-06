const Generator={

generate(evidence,incident){

return{
reportId:"REPORT-"+Date.now(),
projectId:evidence.projectId,
incidentId:incident.incidentId,
platform:evidence.platform,
client:evidence.client,

timeline:[
{
event:"project_snapshot_created",
time:evidence.capturedAtISO
},
{
event:"incident_detected",
time:new Date().toISOString()
}
],

evidence:{
hash:evidence.evidenceHash,
files:evidence.files,
dependencies:evidence.dependencies
},

incident:{
category:incident.category,
description:incident.description,
severity:incident.severity
},

generatedAt:Date.now(),
generatedAtISO:new Date().toISOString(),
status:"generated"
};

},

health(){

return{
service:"AfriDebugIncidentReportGenerator",
status:"healthy"
};

}

};

export default Generator;
