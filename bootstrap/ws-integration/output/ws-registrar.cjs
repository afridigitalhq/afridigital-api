
const { integrate } = require("./ws-integration.cjs");

function registerService(name,handler){
    return integrate(name,handler);
}

function registerMany(services=[]){
    return services.map(({name,handler})=>registerService(name,handler));
}

module.exports={
    registerService,
    registerMany
};
