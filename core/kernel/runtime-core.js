class RuntimeCore{
  constructor(services={}){
    this.services=services;
  }

  dispatch(event){
    return {
      ok:true,
      handled:true,
      event,
      timestamp:Date.now()
    };
  }

  snapshot(){ return {}; }
  telemetry(){ return {}; }
  ledger(){ return []; }
}

module.exports={RuntimeCore};
