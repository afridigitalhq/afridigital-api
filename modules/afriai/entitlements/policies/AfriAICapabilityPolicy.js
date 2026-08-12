import AfriAICapabilityEntitlementRegistry from "../capabilities/AfriAICapabilityEntitlementRegistry.js";

const AfriAICapabilityPolicy = {

  resolve({
    product = null,
    capability = null,
    action = null,
    context = {}
  } = {}){

    const definition =
      AfriAICapabilityEntitlementRegistry.get
        ? AfriAICapabilityEntitlementRegistry.get(
            product,
            capability
          )
        : null;

    const actions =
      definition?.actions || [];

    const supported =
      actions.includes("*") ||
      actions.includes(action);

    return {

      product,

      capability,

      action,

      supported,

      status:
        supported
          ? "SUPPORTED"
          : "UNRESOLVED",

      definition,

      context

    };

  }

};

export default AfriAICapabilityPolicy;
