const keys = [];

const AfriDebugApiKeyRuntime = {

  create(owner, plan="FREE") {

    const key = {
      id:`KEY-${Date.now()}`,
      token:`AFD-${Math.random().toString(36).slice(2)}`,
      owner,
      plan,
      status:"ACTIVE",
      createdAt:Date.now()
    };

    keys.push(key);

    return key;
  },


  revoke(id) {

    const key = keys.find(k => k.id === id);

    if (!key) {
      return {
        success:false,
        reason:"KEY_NOT_FOUND"
      };
    }

    key.status="REVOKED";

    return {
      success:true,
      key
    };
  },


  list() {
    return keys;
  }

};

export default AfriDebugApiKeyRuntime;
