import CoreDelegationRegistry from "./CoreDelegationRegistry.js";
import CoreDelegationPlanner from "./CoreDelegationPlanner.js";
import CoreDelegationDispatcher from "./CoreDelegationDispatcher.js";

const CoreDelegationEngine = {
  async delegate(request = {}) {
    const plan = CoreDelegationPlanner.plan(request);

    if (plan.status !== "PLANNED") {
      return {
        success: false,
        status: "INVALID_DELEGATION_REQUEST",
        plan
      };
    }

    const provider = CoreDelegationRegistry.resolve(plan.capability);

    if (!provider) {
      return {
        success: false,
        status: "CAPABILITY_NOT_FOUND",
        plan,
        availableCapabilities: CoreDelegationRegistry.list()
      };
    }

    const dispatch = await CoreDelegationDispatcher.dispatch(provider, plan);

    return {
      success: dispatch.success,
      status: dispatch.status,
      delegationId: plan.id,
      capability: plan.capability,
      plan,
      result: dispatch.result || null
    };
  },

  register(name, provider) {
    return CoreDelegationRegistry.register(name, provider);
  },

  capabilities() {
    return CoreDelegationRegistry.list();
  },

  health() {
    return {
      service: "CoreDelegationEngine",
      status: "healthy",
      capabilities: CoreDelegationRegistry.list()
    };
  }
};

export default CoreDelegationEngine;
