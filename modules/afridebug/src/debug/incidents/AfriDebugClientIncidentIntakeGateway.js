const Gateway={

create(report){

return{
 incidentId:"INC-"+Date.now(),
 client:report.client,
 source:report.source,
 category:report.category,
 description:report.description,
 receivedAt:Date.now(),
 receivedAtISO:new Date().toISOString(),
 status:"received"
};

},

validate(incident){

return{
 valid:Boolean(
 incident.incidentId &&
 incident.client &&
 incident.category
 ),
 incidentId:incident.incidentId,
 checkedAt:Date.now(),
 checkedAtISO:new Date().toISOString()
};

},

health(){

return{
 service:"AfriDebugClientIncidentIntakeGateway",
 status:"healthy"
};

}

};

export default Gateway;
