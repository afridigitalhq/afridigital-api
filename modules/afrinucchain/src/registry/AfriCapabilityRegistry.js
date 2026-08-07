export class AfriCapabilityRegistry {
  constructor(){
    this.capabilities = [
      {
        module:"afriai",
        actions:["diagnose"]
      },
      {
        module:"afriwhatsapp",
        actions:["repair"]
      },
      {
        module:"afriweb",
        actions:["verify"]
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
