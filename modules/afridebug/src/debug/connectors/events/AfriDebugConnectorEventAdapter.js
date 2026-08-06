const events=[];

const AfriDebugConnectorEventAdapter = {

  receive(connector,event){

    const record={

      connectorId:connector.id,

      connectorName:connector.name,

      type:event.type || "unknown",

      payload:event.payload || {},

      approvalRequired:true,

      receivedAt:Date.now()

    };

    events.push(record);

    return record;

  },

  list(){

    return events;

  },

  stats(){

    return {

      events:events.length

    };

  },

  health(){

    return {

      service:"AfriDebugConnectorEventAdapter",

      status:"healthy"

    };

  }

};

export default AfriDebugConnectorEventAdapter;
