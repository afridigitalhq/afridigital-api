
const registry=[];

function register(name,path){
    registry.push({
        name,
        path,
        timestamp:Date.now()
    });
}

function list(){
    return registry;
}

module.exports={
    register,
    list
};
