const CoreDelegationDispatcher = {
  async dispatch(provider, plan) {
    if (!provider) {
      return {
        success: false,
        status: "CAPABILITY_NOT_FOUND",
        plan
      };
    }

    if (typeof provider === "function") {
      return {
        success: true,
        status: "DISPATCHED",
        result: await provider(plan)
      };
    }

    if (typeof provider.execute === "function") {
      return {
        success: true,
        status: "DISPATCHED",
        result: await provider.execute(plan)
      };
    }

    if (typeof provider.run === "function") {
      return {
        success: true,
        status: "DISPATCHED",
        result: await provider.run(plan)
      };
    }

    return {
      success: false,
      status: "INVALID_PROVIDER",
      plan
    };
  }
};

export default CoreDelegationDispatcher;
