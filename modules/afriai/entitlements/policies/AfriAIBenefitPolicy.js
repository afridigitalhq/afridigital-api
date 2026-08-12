import AfriAIProductEntitlementCatalog from "../catalog/AfriAIProductEntitlementCatalog.js";

const AfriAIBenefitPolicy = {

  resolve({
    product = null,
    capability = null,
    plan = "free",
    context = {}
  } = {}){

    const productDefinition =
      AfriAIProductEntitlementCatalog.get
        ? AfriAIProductEntitlementCatalog.get(product)
        : null;

    const planDefinition =
      productDefinition?.plans?.[plan] || null;

    return {

      product,

      capability,

      plan,

      benefits:
        planDefinition?.benefits || [],

      status:
        planDefinition
          ? "RESOLVED"
          : "UNRESOLVED",

      context

    };

  }

};

export default AfriAIBenefitPolicy;
