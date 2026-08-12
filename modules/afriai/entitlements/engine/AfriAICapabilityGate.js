import AfriPlatformAuthorization from "../../../platform/authorization/AfriPlatformAuthorization.js";
import AfriAIEntitlementEngine from "./AfriAIEntitlementEngine.js";

const AfriAICapabilityGate = {

  check({
    identity={},
    user={},
    product=null,
    capability=null,
    action=null,
    plan="free",
    context={}
  }={}){

    const canonicalIdentity =
      identity && Object.keys(identity).length
        ? identity
        : {
            user:user?.id || "guest",
            role:user?.role || "GUEST"
          };

    const authority =
      AfriPlatformAuthorization.authorize(
        canonicalIdentity,
        "ENTITLEMENT_ADMIN"
      );

    const entitlement =
      AfriAIEntitlementEngine.evaluate({
        user:{
          id:canonicalIdentity.user
        },
        plan,
        product,
        capability,
        action,
        context:{
          ...context,
          identity:canonicalIdentity
        }
      });

    const supported =
      entitlement?.access?.capability?.supported === true;

    const included =
      entitlement?.access?.subscription?.included === true;

    const unrestricted =
      authority?.unrestricted === true;

    const allowed =
      unrestricted ||
      (supported && included);

    return {
      allowed,
      unrestricted,
      supported,
      included,
      product,
      capability,
      action,
      plan,
      identity:canonicalIdentity,
      authority,
      entitlement,
      status:
        allowed
          ? unrestricted
            ? "ADMIN_CAPABILITY_ALLOWED"
            : "CAPABILITY_ALLOWED"
          : "CAPABILITY_DENIED"
    };

  }

};

export default AfriAICapabilityGate;
