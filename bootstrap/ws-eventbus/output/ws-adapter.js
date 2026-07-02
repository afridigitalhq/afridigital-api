
function createWSAdapter(bus){

  return {

    publish(type,payload){
      bus.publish(type,payload);
    },

    subscribe(type,handler){
      return bus.subscribe(type,handler);
    }

  };

}

module.exports={ createWSAdapter };
