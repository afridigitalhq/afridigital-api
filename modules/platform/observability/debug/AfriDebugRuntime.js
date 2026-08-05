const AfriDebugRuntime = {
  events:[],

  event(stage,data={}){
    const entry={
      stage,
      data,
      timestamp:new Date().toISOString()
    };

    this.events.push(entry);
    console.log("🛠 AFRIDEBUG EVENT:",JSON.stringify(entry));
    return entry;
  },

  inspect(target={},meta={}){
    return {
      debug:true,
      target,
      meta,
      timestamp:new Date().toISOString(),
      status:"INSPECTED"
    };
  },

  error(error,context={}){
    return {
      debug:true,
      error:error?.message || error,
      context,
      timestamp:new Date().toISOString(),
      status:"ERROR_CAPTURED"
    };
  },

  health(component,status){
    return {
      component,
      status,
      checkedAt:new Date().toISOString()
    };
  }
};

export default AfriDebugRuntime;
