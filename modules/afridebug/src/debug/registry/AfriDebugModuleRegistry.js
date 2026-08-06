const modules = new Map();

const AfriDebugModuleRegistry = {

  register(name, module){

    if(!name || !module) return false;

    modules.set(name, module);

    return true;
  },

  get(name){

    return modules.get(name) || null;

  },

  list(){

    return Array.from(modules.keys());

  },

  has(name){

    return modules.has(name);

  },

  remove(name){

    return modules.delete(name);

  },

  clear(){

    modules.clear();

  }

};

export default AfriDebugModuleRegistry;
