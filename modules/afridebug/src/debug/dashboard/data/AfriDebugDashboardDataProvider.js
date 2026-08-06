import Storage from "../../connectors/storage/AfriDebugPersistentStorageAdapter.js";

const AfriDebugDashboardDataProvider = {

  overview(){

    const state = Storage.get();

    return {

      connectors:
        state.connectors.length,

      events:
        state.events.length,

      approvalEvents:
        state.events.filter(
          e=>e.approvalRequired
        ).length

    };

  },


  connectors(){

    return Storage.get().connectors;

  },


  events(){

    return Storage.get().events;

  },


  health(){

    return {

      service:"AfriDebugDashboardDataProvider",

      status:"healthy"

    };

  },


  report(){

    return {

      overview:this.overview(),

      connectors:this.connectors(),

      events:this.events()

    };

  }

};

export default AfriDebugDashboardDataProvider;
