const services=new Map();

export class ServiceStatusManager{

 update(id,status){

  services.set(id,status);

 }

 get(id){

  return services.get(id);

 }

}

export const serviceStatusManager =
new ServiceStatusManager();
