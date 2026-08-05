const AfriDebugRuntime = {
  traces:{},

  start(service="unknown"){
    const requestId =
      `${service.toLowerCase()}-${Date.now()}`;

    this.traces[requestId]={
      requestId,
      service,
      events:[],
      startedAt:new Date().toISOString()
    };

    return requestId;
  },

  event(requestId,stage,data={}){
    const entry={
      stage,
      data,
      timestamp:new Date().toISOString()
    };

    if(this.traces[requestId]){
      this.traces[requestId].events.push(entry);
    }

    console.log(
      "🛠 AFRIDEBUG EVENT:",
      JSON.stringify({
        requestId,
        ...entry
      })
    );

    return entry;
  },

  finish(requestId,status="COMPLETED"){
    if(!this.traces[requestId]) return null;

    this.traces[requestId].status=status;
    this.traces[requestId].finishedAt=
      new Date().toISOString();

    return this.traces[requestId];
  },

  getTrace(requestId){
    return this.traces[requestId] || null;
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
