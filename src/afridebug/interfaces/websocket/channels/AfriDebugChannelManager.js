const channels=new Map();

const AfriDebugChannelManager={

  join(channel,id){

    if(!channels.has(channel)){

      channels.set(channel,[]);

    }

    channels.get(channel).push(id);

    return{

      success:true,

      channel,

      members:channels.get(channel).length

    };

  },

  list(channel){

    return channels.get(channel)||[];

  },

  stats(){

    return{

      channels:channels.size

    };

  }

};

export default AfriDebugChannelManager;
