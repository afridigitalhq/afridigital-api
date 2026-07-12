
const { createManifest } = require("./ws-manifest");
const { discover } = require("./ws-discovery");

function initializeRuntime(services=[]){
    const manifest=createManifest(services);
    const registered=discover(manifest);

    return{
        manifest,
        registered
    };
}

module.exports={
    initializeRuntime
};
