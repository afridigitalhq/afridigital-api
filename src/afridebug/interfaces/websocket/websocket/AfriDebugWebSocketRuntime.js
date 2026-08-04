const sockets=[];

const AfriDebugWebSocketRuntime={

  connect(input={}){

    const socket={

      id:`WS-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,

      clientId:input.clientId||null,

      investigationId:input.investigationId||null,

      status:"CONNECTED",

      connectedAt:Date.now()

    };

    sockets.push(socket);

    return socket;

  },

  list(){

    return sockets;

  },

  stats(){

    return{

      sockets:sockets.length

    };

  }

};

export default AfriDebugWebSocketRuntime;
