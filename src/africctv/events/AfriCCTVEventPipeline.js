const listeners = new Set();

export class AfriCCTVEventPipeline {

  subscribe(client){
    listeners.add(client);
  }

  unsubscribe(client){
    listeners.delete(client);
  }

  broadcast(event){

    const payload = {
      source:"africctv",
      timestamp:Date.now(),
      ...event
    };

    for(const client of listeners){
      try{
        client(payload);
      }catch(err){
        console.log("CCTV EVENT ERROR:",err.message);
      }
    }

    return payload;
  }

}

export const afriCCTVEventPipeline =
new AfriCCTVEventPipeline();
