import Storage from "../storage/AfriDebugConnectorStateStorage.js";

const AfriDebugConnectorObservabilityRuntime = {

  health(){

    const state = Storage.get();

    return {

      service:"AfriDebugConnectorObservabilityRuntime",

      status:"healthy",

      connectors:
        state.connectors.length,

      events:
        state.events.length

    };

  },


  metrics(){

    const state = Storage.get();

    return {

      totalConnectors:
        state.connectors.length,

      totalEvents:
        state.events.length,

      approvalRequiredEvents:
        state.events.filter(
          e=>e.approvalRequired
        ).length

    };

  },


  report(){

    return {

      health:this.health(),

      metrics:this.metrics()

    };

  }

};

export default AfriDebugConnectorObservabilityRuntime;
