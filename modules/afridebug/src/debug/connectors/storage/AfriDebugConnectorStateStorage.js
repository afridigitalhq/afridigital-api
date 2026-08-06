const state = {

  connectors:[],

  events:[]

};

const AfriDebugConnectorStateStorage = {

  saveConnector(connector){

    state.connectors.push(connector);

    return connector;

  },

  saveEvent(event){

    state.events.push(event);

    return event;

  },

  get(){

    return state;

  },

  stats(){

    return {

      connectors:state.connectors.length,

      events:state.events.length

    };

  },

  health(){

    return {

      service:"AfriDebugConnectorStateStorage",

      status:"healthy"

    };

  }

};

export default AfriDebugConnectorStateStorage;
