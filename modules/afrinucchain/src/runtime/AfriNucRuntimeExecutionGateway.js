import {AfriNucRuntimeExecutionEngine} from "./AfriNucRuntimeExecutionEngine.js";

export class AfriNucRuntimeExecutionGateway {

  constructor(){

    this.component="AfriNuc Runtime Execution Gateway";
    this.engine=new AfriNucRuntimeExecutionEngine();

  }

  execute(request){

    return this.engine.execute(
      request.capability,
      request.payload || {}
    );

  }

  health(){

    return {
      component:this.component,
      status:"READY",
      runtime:"AfriNucChain Runtime",
      engine:"AfriNucRuntimeExecutionEngine",
      healthy:true,
      checkedAt:new Date().toISOString()
    };

  }

}
