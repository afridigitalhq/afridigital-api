const runtimes = new Map();

const AfriDebugRuntimeRegistry = {

  register(name, runtime){

    if(!name || !runtime) return false;

    runtimes.set(name, runtime);

    return true;

  },

  start(name, payload={}){

    const runtime = runtimes.get(name);

    if(!runtime) return null;

    if(typeof runtime.start === "function"){

      return runtime.start(payload);

    }

    return {
      runtime:name,
      status:"READY"
    };

  },

  get(name){

    return runtimes.get(name) || null;

  },

  list(){

    return Array.from(runtimes.keys());

  },

  health(){

    return {
      total:runtimes.size,
      runtimes:Array.from(runtimes.keys())
    };

  }

};

export default AfriDebugRuntimeRegistry;
