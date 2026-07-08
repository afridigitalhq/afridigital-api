const tenants=new Map();

export class EnterpriseTenantControl {

 create(id){

  tenants.set(id,{
   id,
   isolation:"ENABLED",
   users:[]
  });

  return tenants.get(id);
 }


 get(id){
  return tenants.get(id);
 }

}


export const enterpriseTenantControl =
new EnterpriseTenantControl();
