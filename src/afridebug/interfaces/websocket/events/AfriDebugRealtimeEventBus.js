const events=[];

const AfriDebugRealtimeEventBus={

  publish(input={}){

    const event={

      id:`RTEVENT-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,

      channel:input.channel||"global",

      type:input.type||"UNKNOWN",

      payload:input.payload||{},

      timestamp:Date.now()

    };

    events.push(event);

    return event;

  },

  list(channel=null){

    return channel
      ? events.filter(e=>e.channel===channel)
      : events;

  },

  stats(){

    return{

      events:events.length

    };

  }

};

export default AfriDebugRealtimeEventBus;
