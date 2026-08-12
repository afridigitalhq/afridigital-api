const products = {};

const AfriAIProductEntitlementCatalog = {

  register(productId, definition = {}){

    if(!productId){
      throw new Error("AfriAI productId required");
    }

    products[productId] = {

      productId,

      name:
        definition.name ||
        productId,

      status:
        definition.status ||
        "ACTIVE",

      capabilities:
        definition.capabilities ||
        {},

      plans:
        definition.plans ||
        {},

      payg:
        definition.payg ||
        {
          enabled:false,
          capabilities:{}
        },

      adUnlock:
        definition.adUnlock ||
        {
          enabled:false,
          capabilities:{}
        },

      upgradeBenefits:
        definition.upgradeBenefits ||
        {},

      metadata:
        definition.metadata ||
        {},

      version:
        definition.version ||
        "1.0"

    };

    return products[productId];

  },

  get(productId){

    return products[productId] || null;

  },

  has(productId){

    return Boolean(
      products[productId]
    );

  },

  list(){

    return Object.values(
      products
    );

  },

  remove(productId){

    return delete products[
      productId
    ];

  }

};

export default AfriAIProductEntitlementCatalog;
