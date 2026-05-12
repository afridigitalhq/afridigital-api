const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AFRIDIGITAL V19 KYC ENGINE
 * - Identity verification system
 * - Withdrawal compliance gate
 * - Global KYC support
 */

class AfriV19KYCSystem {

  constructor() {
    this.requiredCore = ["phone", "email", "pin"];
    this.govIdOptions = ["nin", "bvn", "equivalent_id"];
  }

  /**
   * 🧠 CORE KYC VALIDATION
   */
  validateCore(user) {

    for (let field of this.requiredCore) {
      if (!user.kyc || !user.kyc[field]) {
        return {
          valid: false,
          stage: "CORE_KYC",
          message: `Missing required field: ${field}`
        };
      }
    }

    return { valid: true };
  }

  /**
   * 🆔 GOVERNMENT ID VALIDATION (ONE REQUIRED)
   */
  validateGovId(user) {

    const kyc = user.kyc || {};

    const hasGovId =
      kyc.nin ||
      kyc.bvn ||
      kyc.equivalent_id;

    if (!hasGovId) {
      return {
        valid: false,
        stage: "GOV_ID",
        message: "Provide NIN, BVN or Equivalent ID"
      };
    }

    return { valid: true };
  }

  /**
   * 🔐 FULL KYC STATUS CHECK
   */
  isFullyVerified(user) {

    const core = this.validateCore(user);
    if (!core.valid) return false;

    const gov = this.validateGovId(user);
    if (!gov.valid) return false;

    return true;
  }

  /**
   * 💸 WITHDRAWAL ELIGIBILITY CHECK
   */
  canWithdraw(user) {

    // First withdrawal bypass rule
    if (!user.hasWithdrawnBefore) {
      return { allowed: true, reason: "FIRST_WITHDRAWAL_TRUST_MODE" };
    }

    // After first withdrawal → strict KYC
    if (!this.isFullyVerified(user)) {
      return {
        allowed: false,
        reason: "KYC_REQUIRED",
        message: "Complete KYC to continue withdrawals"
      };
    }

    return { allowed: true };
  }

  /**
   * 📢 AFIAI KYC REMINDER MESSAGE
   */
  kycReminder(user) {

    if (user.hasWithdrawnBefore && !this.isFullyVerified(user)) {

      return `
📢 KYC Verification Required

To continue withdrawals:

📱 Phone ✔
📧 Email ✔
🔐 PIN ✔

AND ONE OF:
🆔 NIN / BVN / National ID

⚠️ Complete verification to unlock withdrawals.
`;
    }

    return null;
  }

}

module.exports = AfriV19KYCSystem;
