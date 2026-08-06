import IncidentStore from "../../storage/AfriDebugIncidentStore.js";

const AfriDebugIncidentPersistenceBridge = {

  persist(incident = {}) {

    const stored = IncidentStore.save({

      incidentId:incident.incidentId,

      source:incident.source,

      category:incident.category,

      severity:incident.severity,

      issue:incident.issue,

      repository:incident.repository,

      component:incident.component,

      status:incident.status

    });


    return {

      incident,

      stored,

      persistenceStatus:"stored"

    };

  },


  health(){

    return {

      service:"AfriDebugIncidentPersistenceBridge",

      status:"healthy"

    };

  }

};


export default AfriDebugIncidentPersistenceBridge;
