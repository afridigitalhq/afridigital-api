import AfriPlatformAuthorization from "../../../platform/authorization/AfriPlatformAuthorization.js";
import AfriAIEcosystemCatalogBootstrap from "../ecosystem/AfriAIEcosystemCatalogBootstrap.js";
import AfriAIEcosystemEntitlementAdapter from "../ecosystem/AfriAIEcosystemEntitlementAdapter.js";
import AfriAISubscriptionPolicy from "../policies/AfriAISubscriptionPolicy.js";
import AfriAIPAYGPolicy from "../policies/AfriAIPAYGPolicy.js";
import AfriAIAdUnlockPolicy from "../policies/AfriAIAdUnlockPolicy.js";
import AfriAICapabilityPolicy from "../policies/AfriAICapabilityPolicy.js";
import AfriAIBenefitPolicy from "../policies/AfriAIBenefitPolicy.js";
import AfriAIEntitlementAdminConfig from "../admin/AfriAIEntitlementAdminConfig.js";

const AfriAIEntitlementEngine = { 
  initializeEcosystemCatalog(){
    return AfriAIEcosystemCatalogBootstrap.initialize();
  }, 
  resolveProductEntitlement({product="",plan="free",context={}}={}){
    const identity=context?.identity || context?.user || {};
    const adminAuthorization=AfriPlatformAuthorization.authorize(
      identity,
      "ENTITLEMENT_ADMIN"
    );

    if(adminAuthorization.allowed && adminAuthorization.unrestricted){
      return{
        status:"ADMIN_ENTITLEMENT_RESOLVED",
        product,
        plan:"admin",
        benefits:["Unlimited administrative access"],
        capabilities:["*"],
        limits:{aiRequests:"unlimited",productUsage:"unlimited",ecosystemAccess:"unlimited"},
        admin:true,
        unlimited:true,
        source:"AfriPlatformAuthorization",
        authority:adminAuthorization
      };
    }
    return AfriAIEcosystemEntitlementAdapter.resolve({product,plan,context});
  },

  evaluate({
    user = {},
    plan = "free",
    product = null,
    capability = null,
    action = null,
    context = {}
  } = {}){

    const adminConfig =
      AfriAIEntitlementAdminConfig.get();

    const subscription =
      AfriAISubscriptionPolicy.resolve({
        plan,
        capability,
        action,
        context
      });

    const capabilityPolicy =
      AfriAICapabilityPolicy.resolve({
        product,
        capability,
        action,
        context
      });

    const payg =
      AfriAIPAYGPolicy.resolve({
        capability,
        action,
        context
      });

    const adUnlock =
      AfriAIAdUnlockPolicy.resolve({
        capability,
        action,
        context
      });

    const benefits =
      AfriAIBenefitPolicy.resolve({
        product,
        capability,
        plan,
        context
      });

    let decision = "UPGRADE_REQUIRED";

    if(subscription.included){
      decision = "SUBSCRIPTION_INCLUDED";
    }else if(payg.enabled){
      decision = "PAYG_AVAILABLE";
    }else if(adUnlock.enabled){
      decision = "AD_UNLOCK_AVAILABLE";
    }

    return {

      status:"ENTITLEMENT_EVALUATED",

      subject:{
        userId:user?.id || "guest",
        plan,
        product,
        capability,
        action
      },

      decision,

      access:{
        subscription,
        capability:capabilityPolicy
      },

      unlock:{
        payg,
        adUnlock
      },

      benefits,

      policy:{
        source:adminConfig.source,
        editable:adminConfig.editable,
        status:adminConfig.status
      },

      execution:{
        allowed:
          decision === "SUBSCRIPTION_INCLUDED",

        requiresUnlock:
          decision === "PAYG_AVAILABLE" ||
          decision === "AD_UNLOCK_AVAILABLE",

        requiresUpgrade:
          decision === "UPGRADE_REQUIRED"
      }

    };

  }

};

export default AfriAIEntitlementEngine;
