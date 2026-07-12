
const { registerService } = require("./ws-registrar");

function bootstrapRealtimeHub(handler){
    return registerService("realtime.hub",handler);
}

module.exports={
    bootstrapRealtimeHub
};
