
function createManifest(services=[]){
    return services.map(service=>({
        id:service.name,
        enabled:true,
        handler:service.handler
    }));
}

module.exports={
    createManifest
};
