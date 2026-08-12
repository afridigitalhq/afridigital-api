import AfriAIProductEntitlementCatalog from "../catalog/AfriAIProductEntitlementCatalog.js";

const AfriAIProductEntitlementResolver = {

  resolve({
    product = "",
    capability = "",
    action = "",
    plan = "free",
    context = {}
  } = {}){

    const definition =
      AfriAIProductEntitlementCatalog.get(
        product
      );

    if(!definition){

      return {

        status:"PRODUCT_NOT_REGISTERED",

        product,

        capability,

        action,

        plan,

        accessible:false,

        reason:"PRODUCT_ENTITLEMENT_UNAVAILABLE",

        context

      };

    }

    const capabilityDefinition =
      definition.capabilities?.[
        capability
      ] || null;

    const planDefinition =
      definition.plans?.[
        plan
      ] || null;

    const capabilityPaths =
      planDefinition?.capabilities || [];

    const exactCapability =
      action
        ? `${capability}.${action}`
        : capability;

    const included =
      capabilityPaths.includes("*") ||
      capabilityPaths.includes(
        exactCapability
      ) ||
      capabilityPaths.includes(
        `${capability}.*`
      ) ||
      capabilityPaths.includes(
        capability
      );

    const paygDefinition =
      definition.payg
        ?.capabilities
        ?.[capability] || null;

    const adUnlockDefinition =
      definition.adUnlock
        ?.capabilities
        ?.[capability] || null;

    const upgradeBenefits =
      definition.upgradeBenefits || {};

    const availableUpgrades =
      Object.entries(
        upgradeBenefits
      )
      .map(
        ([targetPlan, value]) => ({
          plan:targetPlan,
          from:value.from || null,
          benefits:value.benefits || []
        })
      )
      .filter(
        item =>
          item.from === plan
      );

    let decision =
      "UPGRADE_REQUIRED";

    if(included){

      decision =
        "SUBSCRIPTION_INCLUDED";

    }else if(
      paygDefinition?.enabled
    ){

      decision =
        "PAYG_AVAILABLE";

    }else if(
      adUnlockDefinition?.enabled
    ){

      decision =
        "AD_UNLOCK_AVAILABLE";

    }

    return {

      status:"PRODUCT_ENTITLEMENT_RESOLVED",

      product,

      capability,

      action,

      plan,

      accessible:included,

      decision,

      capabilityDefinition,

      planDefinition,

      unlockOptions:{

        payg:{
          available:
            Boolean(
              paygDefinition?.enabled
            ),

          configuration:
            paygDefinition || null
        },

        adUnlock:{
          available:
            Boolean(
              adUnlockDefinition?.enabled
            ),

          configuration:
            adUnlockDefinition || null
        }

      },

      upgradeOptions:
        availableUpgrades,

      context

    };

  }

};

export default AfriAIProductEntitlementResolver;
