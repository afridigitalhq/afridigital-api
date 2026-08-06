const connectors=new Map();

const AfriDebugConnectorRegistryRuntime={
register(name,adapter){
connectors.set(name,adapter);
return{registered:true,name,total:connectors.size};
},
get(name){
return connectors.get(name)||null;
},
list(){
return [...connectors.keys()];
},
stats(){
return{registeredConnectors:connectors.size};
},
health(){
return{
service:"AfriDebugConnectorRegistryRuntime",
status:"healthy",
connectors:connectors.size
};
}
};

export default AfriDebugConnectorRegistryRuntime;
