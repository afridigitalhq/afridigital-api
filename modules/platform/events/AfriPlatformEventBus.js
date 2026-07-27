const AfriPlatformEventBus = {
  publish(event,payload={}){
    return {
      event,
      payload,
      status:"PUBLISHED"
    };
  },
  subscribe(event){
    return {
      event,
      status:"SUBSCRIBED"
    };
  }
};

export default AfriPlatformEventBus;
