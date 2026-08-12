import AfriAIPlanEntitlementRegistry from "../plans/AfriAIPlanEntitlementRegistry.js";

const AfriAISubscriptionPolicy = {

  resolve({
    plan = "free",
    capability = null,
    action = null,
    context = {}
  } = {}){

    const planDefinition =
      AfriAIPlanEntitlementRegistry.get
        ? AfriAIPlanEntitlementRegistry.get(plan)
        : null;

    const capabilities =
      planDefinition?.capabilities || [];

    const included =
      capabilities.includes("*") ||
      capabilities.includes(capability) ||
      capabilities.includes(`${capability}:${action}`);

    return {

      plan,

      capability,

      action,

      included,

      status:
        included
          ? "INCLUDED"
          : "NOT_INCLUDED",

      limits:
        planDefinition?.limits || {},

      context

    };

  }

};

export default AfriAISubscriptionPolicy;
