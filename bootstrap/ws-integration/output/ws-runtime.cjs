
const { createManifest } = require("./ws-manifest.cjs");
const { discover } = require("./ws-discovery.cjs");

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
