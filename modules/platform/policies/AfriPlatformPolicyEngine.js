const AfriPlatformPolicyEngine = {
  evaluate(policy, context = {}){
    return {
      policy,
      context,
      allowed: true,
      source: "AfriPlatformPolicyEngine"
    };
  }
};

export default AfriPlatformPolicyEngine;
