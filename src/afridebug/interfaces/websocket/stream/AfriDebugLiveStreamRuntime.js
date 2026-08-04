const streams=[];

const AfriDebugLiveStreamRuntime={

  open(input={}){

    const stream={

      id:`STREAM-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,

      investigationId:input.investigationId||null,

      status:"LIVE",

      startedAt:Date.now()

    };

    streams.push(stream);

    return stream;

  },

  list(){

    return streams;

  },

  stats(){

    return{

      streams:streams.length

    };

  }

};

export default AfriDebugLiveStreamRuntime;
