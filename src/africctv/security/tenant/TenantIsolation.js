const tenants = new Map();

export class TenantIsolation {

  registerTenant(tenant){
    tenants.set(tenant.id,{
      id:tenant.id,
      cameras:new Set()
    });

    return tenants.get(tenant.id);
  }


  attachCamera(tenantId,cameraId){

    const tenant=tenants.get(tenantId);

    if(!tenant) return false;

    tenant.cameras.add(cameraId);

    return true;
  }


  canAccess(tenantId,cameraId){

    const tenant=tenants.get(tenantId);

    return tenant?.cameras.has(cameraId) || false;
  }

}


export const tenantIsolation =
new TenantIsolation();
