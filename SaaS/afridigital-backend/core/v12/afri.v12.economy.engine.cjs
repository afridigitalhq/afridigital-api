
/**
 * 🚀 AFRIDIGITAL V12 ECONOMY ENGINE (BASH DEPLOYED)
 */

class AfriV12EconomyEngine {

  constructor(config = {}) {
    this.baseCheckInReward = config.checkInReward || 10;
    this.adPool = config.adPool || [];
    this.couponMode = config.couponMode || false;
  }

  processDailyCheckIn(user) {

    const reward = this.baseCheckInReward;

    user.wallet.africoin += reward;

    const ad = this.getRotatingAd(user);

    return `
📩 Daily Check-In Reward

🎁 +${reward} Africoin credited

💼 Wallet Balance
💵 Native: ₦${user.wallet.native || 0}
🪙 Africoin: ${user.wallet.africoin}
🔒 Escrow: ${user.wallet.escrow || 0}

━━━━━━━━━━━━━━━━━━
🔥 DAILY CHECK-IN COMPLETE
━━━━━━━━━━━━━━━━━━

🖼️ Sponsored Preview
📢 ${ad.title}
🚀 ${ad.subtitle}

━━━━━━━━━━━━━━━━━━
👉 ${ad.cta || "BOOST NOW"}
━━━━━━━━━━━━━━━━━━
`;
  }

  getRotatingAd(user) {

    const ads = this.adPool.length ? this.adPool : [{
      title: "TikTok Boost Offer",
      subtitle: "Grow your reach instantly",
      cta: "BOOST NOW"
    }];

    const index = Math.floor(Math.random() * ads.length);

    const ad = ads[index];

    this.trackImpression(user, ad);

    return ad;
  }

  processBoostCampaign(post, metrics) {

    const { views, clicks, shares } = metrics;

    const basePrice = post.unitPrice || 10;

    const totalViewsCost = views * basePrice;

    let multiplier = 1;

    if (clicks > views * 0.2) multiplier += 0.2;
    if (shares > views * 0.1) multiplier += 0.3;

    const finalCost = totalViewsCost * multiplier;

    return {
      status: "DELIVERED",
      views,
      clicks,
      shares,
      baseCost: totalViewsCost,
      finalCost,
      note: "Boost optimized using engagement signals"
    };
  }

  getWalletSnapshot(user) {
    return {
      native: user.wallet.native,
      africoin: user.wallet.africoin,
      escrow: user.wallet.escrow,
      total:
        (user.wallet.native || 0) +
        (user.wallet.africoin || 0) +
        (user.wallet.escrow || 0)
    };
  }

  trackImpression(user, ad) {
    if (!user.adImpressions) user.adImpressions = [];

    user.adImpressions.push({
      ad: ad.title,
      time: Date.now()
    });
  }

  isCouponVisible() {
    return false;
  }
}

module.exports = AfriV12EconomyEngine;

