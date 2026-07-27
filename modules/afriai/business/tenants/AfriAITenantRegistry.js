const tenants = new Map();

const AfriAITenantRegistry = {

  register(tenant){

    if(!tenant?.tenantId){
      throw new Error("AfriAI tenantId required");
    }

    tenants.set(
      tenant.tenantId,
      {
        ...tenant,
        createdAt:new Date().toISOString(),
        updatedAt:new Date().toISOString()
      }
    );

    return tenants.get(tenant.tenantId);

  },


  get(tenantId){

    return tenants.get(tenantId) || null;

  },


  update(tenantId, updates = {}){

    const existing = tenants.get(tenantId);

    if(!existing){
      return null;
    }

    const updated = {
      ...existing,
      ...updates,
      updatedAt:new Date().toISOString()
    };

    tenants.set(
      tenantId,
      updated
    );

    return updated;

  },


  list(){

    return Array.from(
      tenants.values()
    );

  },


  remove(tenantId){

    return tenants.delete(
      tenantId
    );

  }

};


export default AfriAITenantRegistry;
