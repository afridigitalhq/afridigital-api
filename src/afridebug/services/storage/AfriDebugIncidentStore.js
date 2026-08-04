const incidents = [];

const AfriDebugIncidentStore = {

  save(input = {}) {

    const record = {

      storageId:`INC-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,

      incidentId:input.incidentId || null,

      connector:input.source || null,

      category:input.category || "unknown",

      severity:input.severity || "unknown",

      issue:input.issue || "unknown",

      repository:input.repository || null,

      component:input.component || null,

      status:input.status || "open",

      storedAt:Date.now()

    };

    incidents.push(record);

    return record;

  },


  list(){

    return incidents;

  },


  findByConnector(connector){

    return incidents.filter(
      item=>item.connector===connector
    );

  },


  findByIssue(issue){

    return incidents.filter(
      item=>item.issue===issue
    );

  },


  stats(){

    return {

      incidents:incidents.length

    };

  },


  health(){

    return {

      service:"AfriDebugIncidentStore",

      status:"healthy"

    };

  }

};


export default AfriDebugIncidentStore;
