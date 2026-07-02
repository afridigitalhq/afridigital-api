
const registry=new Map();

function register(name,handler){
    if(registry.has(name)){
        return false;
    }
    registry.set(name,handler);
    return true;
}

function get(name){
    return registry.get(name);
}

function list(){
    return [...registry.keys()];
}

module.exports={
    register,
    get,
    list
};
