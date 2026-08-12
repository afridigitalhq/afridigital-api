import AfriAIEntitlementConfig from "../config/AfriAIEntitlementConfig.js";

const AfriAIPAYGPolicy = {

  resolve({
    capability = null,
    action = null,
    context = {}
  } = {}){

    const configured =
      AfriAIEntitlementConfig
        ?.policies
        ?.payg
        ?.capabilities
        ?.[
          capability
        ];

    const actionConfig =
      configured?.actions?.[action] ||
      configured?.default ||
      null;

    return {

      capability,

      action,

      enabled:
        Boolean(actionConfig?.enabled),

      price:
        actionConfig?.price ?? null,

      currency:
        actionConfig?.currency ?? null,

      status:
        actionConfig?.enabled
          ? "AVAILABLE"
          : "UNAVAILABLE",

      context

    };

  }

};

export default AfriAIPAYGPolicy;
