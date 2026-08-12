import AfriPayPaymentOrchestrator from "../../../../afripai/orchestration/AfriPayPaymentOrchestrator.js";

const AfriAIAfriPayBridge = {
  createPaymentRequirement({
    userId = "",
    tenantId = "",
    amount = 0,
    currency = "AfriCoin",
    method = "",
    purpose = "",
    capability = "",
    product = "",
    plan = "",
    metadata = {}
  } = {}) {
    const payment = AfriPayPaymentOrchestrator.createRequest({
      userId,
      tenantId,
      amount,
      currency,
      method,
      purpose,
      metadata: {
        source: "AfriAIEntitlementEngine",
        capability,
        product,
        plan,
        ...metadata
      }
    });

    return {
      status: "PAYMENT_REQUIREMENT_READY",
      payment,
      capability,
      product,
      plan,
      nextStep: "AFRIPAY_EXECUTION"
    };
  }
};

export default AfriAIAfriPayBridge;
