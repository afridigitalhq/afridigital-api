const connectors={};

const AfriDebugConnectorRegistry = {

  register(connector){

    connectors[connector.id]=connector;

    return connector;

  },

  get(id){

    return connectors[id] || null;

  },

  list(){

    return Object.values(connectors);

  },

  stats(){

    return {

      connectors:Object.keys(connectors).length

    };

  },

  health(){

    return {

      service:"AfriDebugConnectorRegistry",

      status:"healthy"

    };

  }

};

export default AfriDebugConnectorRegistry;
