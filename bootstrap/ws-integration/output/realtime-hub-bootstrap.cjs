
const { registerService } = require("./ws-registrar.cjs");

function bootstrapRealtimeHub(handler){
    return registerService("realtime.hub",handler);
}

module.exports={
    bootstrapRealtimeHub
};
