
const registry=require("./ws-registry.cjs");

function integrate(name,handler){
    const ok=registry.register(name,handler);

    return{
        ok,
        name
    };
}

module.exports={
    integrate
};
