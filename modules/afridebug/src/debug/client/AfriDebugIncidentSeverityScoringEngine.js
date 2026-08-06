const Engine={

score(incident){

let score=0;

if(incident.risk==="critical") score+=40;
else if(incident.risk==="high") score+=30;
else if(incident.risk==="medium") score+=20;
else score+=10;

if(incident.exposedData) score+=25;
if(incident.production) score+=20;
if(incident.publicFacing) score+=10;
if(incident.activeAttack) score+=15;

let severity="low";
if(score>=80) severity="critical";
else if(score>=60) severity="high";
else if(score>=35) severity="medium";

return{
incidentId:incident.incidentId,
score,
severity,
evaluatedAt:Date.now(),
evaluatedAtISO:new Date().toISOString()
};

},

health(){
return{
service:"AfriDebugIncidentSeverityScoringEngine",
status:"healthy"
};
}

};

export default Engine;
