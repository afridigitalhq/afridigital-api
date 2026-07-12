const pipeline=require("./plugin.boot.pipeline");
const runtime=require("./plugin.boot.executor");
const lifecycle=require("./plugin.lifecycle.executor");
const health=require("./plugin.health.executor");
const permission=require("./plugin.permission.executor");
const capability=require("./plugin.capability.executor");
const service=require("./plugin.service.executor");
const router=require("./plugin.router.executor");
const subscription=require("./plugin.subscription.executor");
const ready=require("./plugin.ready.executor");

class KernelBootstrap{

  boot(manifestDir){

    const result={};

    result.pipeline=pipeline.start(manifestDir);
    result.runtime=runtime.boot(manifestDir);
    result.lifecycle=lifecycle.start();
    result.health=health.start();
    result.permission=permission.start();
    result.capability=capability.start();
    result.service=service.start();
    result.router=router.start();
    result.subscription=subscription.start();
    result.ready=ready.start();

    return{
      ok:true,
      stage:"KERNEL_BOOT_COMPLETE",
      result,
      ts:Date.now()
    };

  }

}

module.exports=new KernelBootstrap();
