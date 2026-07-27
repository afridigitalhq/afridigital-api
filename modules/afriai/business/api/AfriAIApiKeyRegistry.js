const apiKeys = new Map();

const AfriAIApiKeyRegistry = {

  register({
    tenantId = "",
    key = "",
    permissions = [],
    status = "ACTIVE"
  } = {}){

    if(!tenantId || !key){
      throw new Error("tenantId and API key required");
    }

    const record = {
      tenantId,
      key,
      permissions,
      status,
      createdAt:new Date().toISOString()
    };

    apiKeys.set(
      key,
      record
    );

    return record;

  },


  get(key){

    return apiKeys.get(key) || null;

  },


  revoke(key){

    const record = apiKeys.get(key);

    if(!record){
      return false;
    }

    record.status = "REVOKED";

    apiKeys.set(
      key,
      record
    );

    return true;

  },


  list(){

    return Array.from(
      apiKeys.values()
    );

  }

};


export default AfriAIApiKeyRegistry;
