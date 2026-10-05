import crypto from "node:crypto";
import AfriAgentsEconomyRegistry from "./AfriAgentsEconomyRegistry.js";
import AfriAgentsEconomyCoupon, { INTERNAL_COUPON_CODE } from "./AfriAgentsEconomyCoupon.js";
import AfriAgentsEconomyPaymentStore from "./AfriAgentsEconomyPaymentStore.js";
import AfriAgentIdentityRegistry from "../identity/AfriAgentIdentityRegistry.js";

function requireText(value, code) {
  if (!value || typeof value !== "string" || !value.trim()) throw new Error(code);
  return value.trim();
}

function normalizeUSD(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) throw new Error("AFRI_ECONOMY_INVALID_USD_AMOUNT");
  return Number(amount.toFixed(8));
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
}

function resolveTier(pricing, tierId) {
  if (pricing.model === "FIXED") {
    if (tierId) throw new Error("AFRI_ECONOMY_TIER_NOT_APPLICABLE");
    return { tierId: null, listPriceUSD: pricing.amountUSD };
  }

  if (pricing.model === "TIERED") {
    const tier = pricing.tiers.find(item => item.id === tierId);
    if (!tier) throw new Error("AFRI_ECONOMY_PRICING_TIER_NOT_FOUND");
    return { tierId: tier.id, listPriceUSD: tier.amountUSD };
  }

  throw new Error("AFRI_ECONOMY_USAGE_PRICING_REQUIRES_USAGE_CONTEXT");
}

function assertCouponEligibility(coupon, payer) {
  if (coupon.type === "INTERNAL") {
    if (payer?.trustDomain !== "INTERNAL" || payer?.organizationId !== "afridigital") {
      throw new Error("AFRI_ECONOMY_INTERNAL_COUPON_FORBIDDEN");
    }
    return;
  }

  if (coupon.type === "EXTERNAL" && payer?.trustDomain !== "EXTERNAL") {
    throw new Error("AFRI_ECONOMY_EXTERNAL_COUPON_FORBIDDEN");
  }
}

const AfriAgentsEconomyPaymentRuntime = {
  createObligation({ taskId, requestId = null, payerAgentId, payeeAgentId, capability, payment = {} } = {}) {
    requireText(taskId, "AFRI_ECONOMY_TASK_ID_REQUIRED");
    requireText(payerAgentId, "AFRI_ECONOMY_PAYER_REQUIRED");
    requireText(payeeAgentId, "AFRI_ECONOMY_PAYEE_REQUIRED");
    requireText(capability, "AFRI_ECONOMY_CAPABILITY_REQUIRED");

    const payer = AfriAgentIdentityRegistry.get(payerAgentId);
    const payee = AfriAgentIdentityRegistry.get(payeeAgentId);

    if (!payer || payer.status !== "ACTIVE") throw new Error("AFRI_ECONOMY_PAYER_NOT_ACTIVE");
    if (!payee || payee.status !== "ACTIVE") throw new Error("AFRI_ECONOMY_PAYEE_NOT_ACTIVE");

    const service = AfriAgentsEconomyRegistry.getService({
      agentId: payeeAgentId,
      capability
    });

    if (!service || service.status !== "ACTIVE") {
      throw new Error("AFRI_ECONOMY_SERVICE_NOT_FOUND");
    }

    const resolved = resolveTier(service.pricing, payment.tierId || null);
    let quote = {
      code: null,
      type: null,
      discountPercent: 0,
      listPriceUSD: resolved.listPriceUSD,
      discountUSD: 0,
      amountDueUSD: resolved.listPriceUSD
    };

    if (payment.couponCode) {
      const coupon = AfriAgentsEconomyCoupon.get(payment.couponCode);
      if (!coupon) throw new Error("AFRI_ECONOMY_COUPON_NOT_FOUND");
      assertCouponEligibility(coupon, payer);
      quote = AfriAgentsEconomyCoupon.apply({
        code: payment.couponCode,
        listPriceUSD: resolved.listPriceUSD
      });
    }

    const existing = this.findByTask(taskId);
    if (existing) return existing;

    const now = Date.now();
    return AfriAgentsEconomyPaymentStore.save({
      paymentId: createId("PAY"),
      taskId,
      requestId,
      payerAgentId,
      payeeAgentId,
      capability,
      service: service.service,
      tierId: resolved.tierId,
      listPriceUSD: normalizeUSD(quote.listPriceUSD),
      couponCode: quote.code,
      discountPercent: quote.discountPercent,
      discountUSD: normalizeUSD(quote.discountUSD),
      amountDueUSD: normalizeUSD(quote.amountDueUSD),
      status: "OBLIGATION",
      settlementProvider: null,
      settlementNetwork: null,
      settlementEnvironment: null,
      transactionHash: null,
      createdAt: now,
      authorizedAt: null,
      completedAt: null,
      cancelledAt: null,
      settlementStartedAt: null,
      settledAt: null
    });
  },

  authorize(paymentId) {
    const payment = AfriAgentsEconomyPaymentStore.get(paymentId);
    if (!payment) throw new Error("AFRI_ECONOMY_PAYMENT_NOT_FOUND");
    if (payment.status !== "OBLIGATION") return payment;
    return AfriAgentsEconomyPaymentStore.save({
      ...payment,
      status: "AUTHORIZED",
      authorizedAt: Date.now()
    });
  },

  complete(paymentId) {
    const payment = AfriAgentsEconomyPaymentStore.get(paymentId);
    if (!payment) throw new Error("AFRI_ECONOMY_PAYMENT_NOT_FOUND");
    if (!["AUTHORIZED", "OBLIGATION"].includes(payment.status)) return payment;
    return AfriAgentsEconomyPaymentStore.save({
      ...payment,
      status: payment.amountDueUSD === 0 ? "NO_SETTLEMENT_REQUIRED" : "READY_FOR_SETTLEMENT",
      completedAt: Date.now()
    });
  },

  cancel(paymentId) {
    const payment = AfriAgentsEconomyPaymentStore.get(paymentId);
    if (!payment) return null;
    if (["CONFIRMED", "FAILED", "CANCELLED", "REFUNDED", "NO_SETTLEMENT_REQUIRED"].includes(payment.status)) return payment;
    return AfriAgentsEconomyPaymentStore.save({
      ...payment,
      status: "CANCELLED",
      cancelledAt: Date.now()
    });
  },

  findByTask(taskId) {
    return AfriAgentsEconomyPaymentStore.list().find(payment => payment.taskId === taskId) || null;
  },

  get(paymentId) {
    return AfriAgentsEconomyPaymentStore.get(paymentId);
  },

  list() {
    return AfriAgentsEconomyPaymentStore.list();
  },

  internalCouponCode: INTERNAL_COUPON_CODE
};

export default AfriAgentsEconomyPaymentRuntime;
