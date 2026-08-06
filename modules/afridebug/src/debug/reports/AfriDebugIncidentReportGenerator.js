const AfriDebugIncidentReportGenerator = {

  generate(event){

    return {

      incidentId:
        "AFD-" + Date.now(),

      source:
        event.connectorName,

      category:
        event.type,

      severity:
        event.payload.severity || "unknown",

      component:
        event.payload.component || event.payload.file || "unknown",

      repository:
        event.payload.repository || "unknown",

      issue:
        event.payload.issue || "unknown",

      receivedAt:
        event.receivedAt,

      status:
        "open"

    };

  },


  health(){

    return {

      service:
        "AfriDebugIncidentReportGenerator",

      status:
        "healthy"

    };

  }

};


export default AfriDebugIncidentReportGenerator;
