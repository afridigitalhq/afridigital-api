import Registry from "../registry/AfriDebugConnectorRegistry.js";

const AfriDebugConnectorDispatcher={
dispatch(target,operation,payload={}){
const connector=Registry.get?Registry.get(target):null;

if(!connector){
return{
accepted:false,
target,
status:"connector_not_found",
dispatchedAt:Date.now(),
dispatchedAtISO:new Date().toISOString()
};
}

if(typeof connector[operation]!=="function"){
return{
accepted:false,
target,
status:"operation_not_supported",
dispatchedAt:Date.now(),
dispatchedAtISO:new Date().toISOString()
};
}

const result=connector[operation](payload);

return{
accepted:true,
target,
connector:target,
operation,
status:"dispatched",
result,
dispatchedAt:Date.now(),
dispatchedAtISO:new Date().toISOString()
};
},

health(){
return{
service:"AfriDebugConnectorDispatcher",
registered:Registry.stats?Registry.stats().registeredConnectors:0,
status:"healthy"
};
}
};

export default AfriDebugConnectorDispatcher;
