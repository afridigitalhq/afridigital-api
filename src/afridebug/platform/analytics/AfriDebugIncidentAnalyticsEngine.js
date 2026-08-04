import IncidentStore from "../storage/AfriDebugIncidentStore.js";

const AfriDebugIncidentAnalyticsEngine = {

  analyze(){

    const incidents = IncidentStore.list();

    const severity = {};

    const connectors = {};

    const issues = {};


    incidents.forEach(item=>{

      severity[item.severity] =
        (severity[item.severity] || 0) + 1;


      connectors[item.connector] =
        (connectors[item.connector] || 0) + 1;


      issues[item.issue] =
        (issues[item.issue] || 0) + 1;

    });


    return {

      totalIncidents: incidents.length,

      severity,

      connectors,

      issues,

      generatedAt:Date.now()

    };

  },


  health(){

    return {

      service:"AfriDebugIncidentAnalyticsEngine",

      status:"healthy"

    };

  }

};


export default AfriDebugIncidentAnalyticsEngine;
