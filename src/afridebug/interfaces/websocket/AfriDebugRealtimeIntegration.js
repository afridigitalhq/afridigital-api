import Events from "./events/AfriDebugRealtimeEventBus.js";
import Stream from "./stream/AfriDebugLiveStreamRuntime.js";
import Sync from "./sync/AfriDebugStateSyncRuntime.js";
import Notify from "./notifications/AfriDebugNotificationRuntime.js";

const AfriDebugRealtimeIntegration={

  publish(input={}){

    const stream=Stream.open({
      investigationId:input.investigationId
    });

    const event=Events.publish({
      channel:"investigation",
      type:input.type||"INVESTIGATION_UPDATED",
      payload:input.payload||{}
    });

    const sync=Sync.sync({
      investigationId:input.investigationId,
      state:input.state||"UPDATED"
    });

    const notification=Notify.send({
      clientId:input.clientId,
      investigationId:input.investigationId,
      title:"Investigation Update",
      message:input.message||"Investigation status changed."
    });

    return{
      stream,
      event,
      sync,
      notification
    };

  },

  health(){

    return{
      service:"AfriDebugRealtimeIntegration",
      status:"healthy"
    };

  }

};

export default AfriDebugRealtimeIntegration;
