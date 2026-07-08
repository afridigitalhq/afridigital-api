const services=new Map();

export class SystemHealthMonitor{

 register(service){

  services.set(service.id,{
   ...service,
   status:"HEALTHY"
  });

 }

 report(){

  return [...services.values()];

 }

}


export const systemHealthMonitor =
new SystemHealthMonitor();
