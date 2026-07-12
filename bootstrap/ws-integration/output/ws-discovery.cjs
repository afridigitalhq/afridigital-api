
const { registerMany } = require("./ws-registrar.cjs");

function discover(services=[]){
    return registerMany(
        services.map(service=>({
            name:service.name,
            handler:service.handler
        }))
    );
}

module.exports={
    discover
};
