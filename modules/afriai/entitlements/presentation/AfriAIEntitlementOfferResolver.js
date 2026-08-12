import AfriAIEntitlementEngine from "../engine/AfriAIEntitlementEngine.js";
import AfriAIProductEntitlementCatalog from "../catalog/AfriAIProductEntitlementCatalog.js";

const AfriAIEntitlementOfferResolver = {

  resolve({
    product = "",
    capability = "",
    plan = "free",
    context = {}
  } = {}){

    const entitlement =
      AfriAIEntitlementEngine.resolve({
        product,
        capability,
        plan,
        context
      });

    const catalog =
      AfriAIProductEntitlementCatalog.get
        ? AfriAIProductEntitlementCatalog.get(product)
        : null;

    return {
      product,
      capability,
      currentPlan:plan,
      entitlement,
      benefits:catalog?.benefits || [],
      options:{
        watchAd:Boolean(entitlement?.adUnlock),
        payAsYouGo:Boolean(entitlement?.payg),
        upgrade:Array.isArray(entitlement?.upgradeOptions)
          ? entitlement.upgradeOptions
          : []
      },
      presentation:{
        status:entitlement?.status || "UNAVAILABLE",
        included:Boolean(entitlement?.included),
        message:entitlement?.included
          ? "This capability is included in your current plan."
          : "This capability isn't included in your current access."
      }
    };

  }

};

export default AfriAIEntitlementOfferResolver;
