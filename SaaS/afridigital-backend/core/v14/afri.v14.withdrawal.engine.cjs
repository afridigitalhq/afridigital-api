const FinanceControl = require("../runtime/safety/finance.control");

/**
 * 🚀 AFRIDIGITAL V14 WITHDRAWAL CONTROL ENGINE
 * - Minimum withdrawal enforcement
 * - Multi-currency threshold logic
 * - 5% withdrawal fee system
 * - Africoin → Native conversion rules
 */

class AfriV14WithdrawalEngine {

  constructor(config = {}) {

    this.nairaMin = config.nairaMin || 2000;
    this.usdMin = config.usdMin || 2;

    this.feeRate = 0.05; // 5% withdrawal fee

    this.exchangeRates = config.rates || {
      NGN: 1,
      USD: 0.0012,
      GHS: 0.015,
      KES: 0.009,
      ZAR: 0.012
    };
  }

  /**
   * 💰 CHECK WITHDRAWAL ELIGIBILITY
   */
  checkWithdrawal(user, amount, currency = "NGN") {

    const rate = this.exchangeRates[currency] || 1;

    const convertedAmount = amount * rate;

    let minRequired =
      currency === "USD"
        ? this.usdMin
        : this.nairaMin;

    const fee = convertedAmount * this.feeRate;

    const totalDeduction = convertedAmount + fee;

    const walletBalance =
      (user.wallet.native || 0) +
      (user.wallet.africoin || 0);

    const canWithdraw = walletBalance >= totalDeduction;

    const remainingToWithdraw = canWithdraw
      ? 0
      : (totalDeduction - walletBalance);

    return {
      currency,
      requested: amount,
      convertedAmount,
      fee,
      totalDeduction,
      minRequired,
      canWithdraw,
      remainingToWithdraw,
      message: canWithdraw
        ? "WITHDRAWAL APPROVED"
        : `INSUFFICIENT BALANCE: You need ${remainingToWithdraw.toFixed(2)} more to withdraw`
    };
  }

  /**
   * 💸 PROCESS WITHDRAWAL
   */
  processWithdrawal(user, amount, currency = "NGN") {

    const check = this.checkWithdrawal(user, amount, currency);

    if (!check.canWithdraw) {
      return {
        status: "FAILED",
        ...check
      };
    }

    user.wallet.native -= check.totalDeduction;

    return {
      status: "SUCCESS",
      deducted: check.totalDeduction,
      fee: check.fee,
      remainingBalance: user.wallet.native,
      message: "Withdrawal completed successfully"
    };
  }

  /**
   * 🔁 AFRICOIN → FIAT CONVERSION RULE
   */
  convertAfricoinToNative(user, africoinAmount) {

    const rate = 1; // internal peg (can be dynamic later)

    const nativeValue = africoinAmount * rate;

    const fee = nativeValue * this.feeRate;

    const finalValue = nativeValue - fee;

    user.wallet.africoin -= africoinAmount;
    user.wallet.native += finalValue;

    return {
      converted: africoinAmount,
      received: finalValue,
      fee,
      status: "CONVERTED"
    };
  }

  /**
   * 📊 WALLET SNAPSHOT (FULL VIEW)
   */
  getWalletSummary(user) {

    return {
      native: user.wallet.native || 0,
      africoin: user.wallet.africoin || 0,
      escrow: user.wallet.escrow || 0,
      total:
        (user.wallet.native || 0) +
        (user.wallet.africoin || 0) +
        (user.wallet.escrow || 0)
    };
  }
}

module.exports = AfriV14WithdrawalEngine;

