import DataProvider from "../data/AfriDebugDashboardDataProvider.js";
import Health from "../health/AfriDebugDashboardHealthAggregator.js";
import Observability from "../../connectors/observability/AfriDebugConnectorObservabilityRuntime.js";

const AfriDebugDashboardRuntime = {

  overview(){

    return DataProvider.overview();

  },


  health(){

    return Health.summary();

  },


  metrics(){

    return Observability.metrics();

  },


  report(){

    return {

      service:"AfriDebugDashboardRuntime",

      overview:
        this.overview(),

      health:
        this.health(),

      metrics:
        this.metrics()

    };

  },


  status(){

    return {

      service:"AfriDebugDashboardRuntime",

      status:"healthy"

    };

  }

};

export default AfriDebugDashboardRuntime;
