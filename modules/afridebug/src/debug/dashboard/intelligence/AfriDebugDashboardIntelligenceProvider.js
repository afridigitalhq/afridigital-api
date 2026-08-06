import Analytics from "../../analytics/AfriDebugIncidentAnalyticsEngine.js";

const AfriDebugDashboardIntelligenceProvider = {

  getOverview(){

    const analytics = Analytics.analyze();

    return {

      dashboard:"AfriDebug",

      metrics:{

        totalIncidents:
          analytics.totalIncidents,

        severity:
          analytics.severity,

        topConnectors:
          analytics.connectors,

        recurringIssues:
          analytics.issues

      },

      generatedAt:
        Date.now()

    };

  },


  health(){

    return {

      service:"AfriDebugDashboardIntelligenceProvider",

      status:"healthy"

    };

  }

};


export default AfriDebugDashboardIntelligenceProvider;
