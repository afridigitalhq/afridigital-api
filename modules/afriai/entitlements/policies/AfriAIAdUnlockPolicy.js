import AfriAIEntitlementConfig from "../config/AfriAIEntitlementConfig.js";

const AfriAIAdUnlockPolicy = {

  resolve({
    capability = null,
    action = null,
    context = {}
  } = {}){

    const configured =
      AfriAIEntitlementConfig
        ?.policies
        ?.adUnlock
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

      requiredAds:
        actionConfig?.requiredAds ?? null,

      mode:
        actionConfig?.mode ||
        "ADMIN_CONFIGURED",

      status:
        actionConfig?.enabled
          ? "AVAILABLE"
          : "UNAVAILABLE",

      context

    };

  }

};

export default AfriAIAdUnlockPolicy;
