const fs = require("fs");
const path = require("path");

const ledger = require("../ledger/ledger.v7.3");
const hub = require("../realtime/event.hub");

class IncentiveRouterV7_4 {

  constructor() {

    this.configFile = path.join(__dirname, "config.v7.4.json");
    this.lockFile = path.join(__dirname, "reward.locks.v7.4.json");
    this.referralFile = path.join(__dirname, "referrals.v7.4.json");

    this._bootstrap();
  }

  _bootstrap() {

    if (!fs.existsSync(this.configFile)) {
      fs.writeFileSync(
        this.configFile,
        JSON.stringify({
          verificationReward: 200,
          premiumCommissionPercent: 10
        }, null, 2)
      );
    }

    if (!fs.existsSync(this.lockFile)) {
      fs.writeFileSync(this.lockFile, JSON.stringify({}, null, 2));
    }

    if (!fs.existsSync(this.referralFile)) {
      fs.writeFileSync(this.referralFile, JSON.stringify({}, null, 2));
    }
  }

  _readJSON(file) {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  }

  _writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  }

  _isValidId(value) {
    return (
      typeof value === "string" &&
      value.trim().length >= 3
    );
  }

  _isValidAmount(value) {
    return (
      typeof value === "number" &&
      value > 0
    );
  }

  registerReferral(userId, affiliateId) {

    if (!this._isValidId(userId)) {
      return { ok:false, error:"invalid_userId" };
    }

    if (!this._isValidId(affiliateId)) {
      return { ok:false, error:"invalid_affiliateId" };
    }

    if (userId === affiliateId) {
      return { ok:false, error:"self_referral_blocked" };
    }

    const refs = this._readJSON(this.referralFile);

    if (refs[userId]) {
      return {
        ok:false,
        error:"referral_already_registered"
      };
    }

    refs[userId] = {
      affiliateId,
      ts: Date.now()
    };

    this._writeJSON(this.referralFile, refs);

    return {
      ok:true,
      userId,
      affiliateId
    };
  }

  rewardVerification(userId) {

    if (!this._isValidId(userId)) {
      return { ok:false, error:"invalid_userId" };
    }

    const refs = this._readJSON(this.referralFile);
    const locks = this._readJSON(this.lockFile);
    const config = this._readJSON(this.configFile);

    if (!refs[userId]) {
      return {
        ok:false,
        error:"no_referral_found"
      };
    }

    const affiliateId = refs[userId].affiliateId;

    const lockKey =
      affiliateId + ":" + userId + ":verification";

    if (locks[lockKey]) {
      return {
        ok:false,
        error:"verification_reward_already_paid"
      };
    }

    ledger.credit(
      affiliateId,
      config.verificationReward,
      {
        type:"verification_reward",
        downliner:userId
      }
    );

    locks[lockKey] = {
      ts: Date.now(),
      reward: config.verificationReward
    };

    this._writeJSON(this.lockFile, locks);

    const event = {
      type:"referral.verification.reward",
      affiliateId,
      userId,
      amount: config.verificationReward,
      ts: Date.now()
    };

    hub.emitEvent(event);

    return {
      ok:true,
      affiliateId,
      reward: config.verificationReward
    };
  }

  rewardPremium(userId, premiumAmount) {

    if (!this._isValidId(userId)) {
      return { ok:false, error:"invalid_userId" };
    }

    if (!this._isValidAmount(premiumAmount)) {
      return { ok:false, error:"invalid_premium_amount" };
    }

    const refs = this._readJSON(this.referralFile);
    const locks = this._readJSON(this.lockFile);
    const config = this._readJSON(this.configFile);

    if (!refs[userId]) {
      return {
        ok:false,
        error:"no_referral_found"
      };
    }

    const affiliateId = refs[userId].affiliateId;

    const lockKey =
      affiliateId + ":" + userId + ":premium";

    if (locks[lockKey]) {
      return {
        ok:false,
        error:"premium_commission_already_paid"
      };
    }

    const reward =
      Math.ceil(
        premiumAmount *
        (config.premiumCommissionPercent / 100)
      );

    ledger.credit(
      affiliateId,
      reward,
      {
        type:"premium_commission",
        downliner:userId
      }
    );

    locks[lockKey] = {
      ts: Date.now(),
      reward
    };

    this._writeJSON(this.lockFile, locks);

    const event = {
      type:"referral.premium.commission",
      affiliateId,
      userId,
      premiumAmount,
      reward,
      ts: Date.now()
    };

    hub.emitEvent(event);

    return {
      ok:true,
      affiliateId,
      reward
    };
  }
}

module.exports = new IncentiveRouterV7_4();
