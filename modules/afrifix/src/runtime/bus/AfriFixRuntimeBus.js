import { AfriFixRuntimeResolver } from "../resolver/AfriFixRuntimeResolver.js";
import { AfriFixExecutionPipeline } from "../pipeline/AfriFixExecutionPipeline.js";

export class AfriFixRuntimeBus{
  constructor(){
    this.resolver=new AfriFixRuntimeResolver();
    this.pipeline=new AfriFixExecutionPipeline();
  }

  dispatch(request={}){
    const route=this.resolver.resolve(request);

    if(route.status!=="RESOLVED"){
      return{
        component:"AfriFix Runtime Bus",
        status:"NOT_ROUTED",
        route,
        timestamp:new Date().toISOString()
      };
    }

    return{
      component:"AfriFix Runtime Bus",
      status:"DISPATCHED",
      channel:request.module,
      route,
      execution:this.pipeline.execute(request),
      publishedAt:new Date().toISOString()
    };
  }
}
