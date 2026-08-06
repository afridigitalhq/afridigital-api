import WhatsApp from "../../connectors/whatsapp/AfriDebugWhatsAppConnector.js";
import Web from "../../connectors/web/AfriDebugWebConnector.js";
import Commerce from "../../connectors/commerce/AfriDebugCommerceConnector.js";
import DesignStudio from "../../connectors/designstudio/AfriDebugDesignStudioConnector.js";

const connectors = [
  WhatsApp,
  Web,
  Commerce,
  DesignStudio
];

const AfriDebugDashboardHealthAggregator = {

  health(){

    return connectors.map(
      connector => connector.health()
    );

  },


  summary(){

    const results = this.health();

    return {

      total:
        results.length,

      healthy:
        results.filter(
          r=>r.status==="ready"
        ).length,

      status:
        results.every(
          r=>r.status==="ready"
        )
        ? "healthy"
        : "degraded"

    };

  },


  report(){

    return {

      service:
        "AfriDebugDashboardHealthAggregator",

      health:
        this.health(),

      summary:
        this.summary()

    };

  }

};

export default AfriDebugDashboardHealthAggregator;
