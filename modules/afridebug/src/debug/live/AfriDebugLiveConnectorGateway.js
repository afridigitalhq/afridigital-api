import Runtime from "../runtime/AfriDebugUnifiedRuntime.js";

const CONNECTORS={
AfriWhatsApp:{channel:"messaging"},
AfriCommerce:{channel:"commerce"},
AfriAI:{channel:"ai"},
AfriWeb:{channel:"web"}
};

const AfriDebugLiveConnectorGateway={
process(target,payload={}){
if(!CONNECTORS[target]){
return{
accepted:false,
reason:"connector_not_supported"
};
}

const execution=Runtime.inspect({
target,
operation:"inspect",
payload
});

return{
accepted:true,
target,
channel:CONNECTORS[target].channel,
execution,
processedAt:Date.now(),
processedAtISO:new Date().toISOString()
};
},

health(){
return{
service:"AfriDebugLiveConnectorGateway",
connectors:Object.keys(CONNECTORS).length,
status:"healthy"
};
}
};

export default AfriDebugLiveConnectorGateway;
