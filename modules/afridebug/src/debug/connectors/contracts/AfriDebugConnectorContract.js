const AfriDebugConnectorContract = {

  register(config={}){

    return {

      id:config.id || "unknown",

      name:config.name || "unknown",

      type:config.type || "external",

      status:"registered",

      approvalRequired:true,

      createdAt:Date.now()

    };

  },

  health(connector){

    return {

      connector:connector.name,

      status:"healthy"

    };

  }

};

export default AfriDebugConnectorContract;
