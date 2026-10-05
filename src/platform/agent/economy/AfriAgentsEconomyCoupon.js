import AfriAgentsEconomyStore from "./AfriAgentsEconomyStore.js";

const INTERNAL_COUPON_CODE = "AFRI-AGT-0126";

function normalizePercent(value) {
  const percent = Number(value);

  if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
    throw new Error("AFRI_ECONOMY_INVALID_DISCOUNT_PERCENT");
  }

  return percent;
}

function validateCode(code) {
  if (!code || typeof code !== "string") {
    throw new Error("AFRI_ECONOMY_COUPON_CODE_REQUIRED");
  }

  return code.trim();
}

const AfriAgentsEconomyCoupon = {

  get(code) {
    return AfriAgentsEconomyStore.getCoupon(validateCode(code));
  },

  list() {
    return AfriAgentsEconomyStore.listCoupons();
  },

  registerExternal({
    code,
    discountPercent = 5
  } = {}) {
    const normalizedCode = validateCode(code);

    if (!/^AFRI-EX-AGT-[A-Za-z0-9]+$/.test(normalizedCode)) {
      throw new Error("AFRI_ECONOMY_INVALID_EXTERNAL_COUPON_CODE");
    }

    const coupon = Object.freeze({
      code: normalizedCode,
      type: "EXTERNAL",
      discountPercent: normalizePercent(discountPercent),
      eligibility: "EXTERNAL_AGENT",
      status: "ACTIVE"
    });

    AfriAgentsEconomyStore.saveCoupon(coupon);

    return coupon;
  },

  deactivate(code) {
    const normalizedCode = validateCode(code);
    const coupon = this.get(normalizedCode);

    if (!coupon) return null;

    const inactive = Object.freeze({
      ...coupon,
      status: "INACTIVE"
    });

    AfriAgentsEconomyStore.saveCoupon(inactive);

    return inactive;
  },

  apply({
    code,
    listPriceUSD
  } = {}) {
    const coupon = this.get(code);

    if (!coupon) {
      throw new Error("AFRI_ECONOMY_COUPON_NOT_FOUND");
    }

    if (coupon.status !== "ACTIVE") {
      throw new Error("AFRI_ECONOMY_COUPON_INACTIVE");
    }

    const price = Number(listPriceUSD);

    if (!Number.isFinite(price) || price < 0) {
      throw new Error("AFRI_ECONOMY_INVALID_LIST_PRICE");
    }

    const discountUSD = Number(
      (price * coupon.discountPercent / 100).toFixed(8)
    );

    const amountDueUSD = Number(
      (price - discountUSD).toFixed(8)
    );

    return Object.freeze({
      code: coupon.code,
      type: coupon.type,
      discountPercent: coupon.discountPercent,
      listPriceUSD: price,
      discountUSD,
      amountDueUSD
    });
  }

};

export { INTERNAL_COUPON_CODE };
export default AfriAgentsEconomyCoupon;
