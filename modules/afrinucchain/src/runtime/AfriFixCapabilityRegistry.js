export class AfriFixCapabilityRegistry {
  constructor(){
    this.capabilities=[
      {
        module:"core",
        actions:["verify","audit","certify"]
      },
      {
        module:"afrifix",
        actions:["verify","execute","repair"]
      },
      {
        module:"afridebug",
        actions:["diagnose","inspect","analyze"]
      },
      {
        module:"afriai",
        actions:["diagnose","verify","analyze"]
      },
      {
        module:"afriwhatsapp",
        actions:["diagnose","repair","verify"]
      },
      {
        module:"afriweb",
        actions:["diagnose","verify","optimize"]
      }
    ];
  }

  resolve(module,action){
    const found=this.capabilities.find(
      c=>c.module===module && c.actions.includes(action)
    );

    return {
      component:"AfriFix Capability Resolver",
      status:found?"SUPPORTED":"UNSUPPORTED",
      module,
      action,
      supported:!!found,
      pipeline:found?"AfriFix Execution Pipeline":null
    };
  }
}
