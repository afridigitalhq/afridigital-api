const { assertApiVersion } = require("../runtime/safety/api.guard");
/**
 * 🚀 AFRIDIGITAL V11 ECONOMY KERNEL
 * Unified Economy + Wallet + Rewards + Marketplace Layer
 */

const V11_KERNEL = {

  version: "V11",

  wallets: {
    native: {
      enabled: true,
      purpose: [
        "deposit",
        "withdrawal",
        "paystack_bridge"
      ]
    },

    africoin: {
      enabled: true,
      purpose: [
        "boosts",
        "ads",
        "marketplace",
        "referrals",
        "subscriptions",
        "creator_rewards",
        "ai_services"
      ]
    },

    escrow: {
      enabled: true,
      purpose: [
        "locked_jobs",
        "task_holding",
        "split_release",
        "arbitration"
      ]
    }
  },

  conversion: {

    depositFlow: [
      "PAYSTACK",
      "NATIVE_WALLET",
      "AUTO_CONVERT",
      "AFRICOIN_WALLET"
    ],

    withdrawalFlow: [
      "AFRICOIN_WALLET",
      "MANUAL_CONVERT",
      "NATIVE_WALLET",
      "PAYSTACK",
      "BANK"
    ]
  },

  economyModules: {

    staking: {
      enabled: true,
      rewardPool: true
    },

    creatorMonetization: {
      enabled: true,
      sources: [
        "boosts",
        "ads",
        "tips",
        "subscriptions"
      ]
    },

    aiSubscriptions: {
      enabled: true,
      plans: [
        "basic",
        "premium",
        "ultra"
      ]
    },

    referralFarming: {
      enabled: true,
      reward: 500,
      verificationRequired: true
    },

    adRewardLoops: {
      enabled: true
    },

    escrowArbitration: {
      enabled: true,
      autoResolve: false
    },

    taskMarketplace: {
      enabled: true,
      splitModel: {
        worker: 60,
        platform: 40
      }
    },

    premiumEconomy: {
      enabled: true,
      benefits: {
        higherDiscountCap: true,
        fasterRewards: true,
        premiumCampaigns: true
      }
    }
  },

  couponSystem: {

    enabled: true,

    generationSources: [
      "ADMIN_DASHBOARD",
      "WHATSAPP_ADMIN",
      "WALLET_CAMPAIGNS"
    ],

    rules: {
      basicMaxDiscount: 15,
      premiumMaxDiscount: 20
    },

    schedules: [
      "FRIDAY_SPECIAL",
      "XMAS",
      "EASTER",
      "RAMADAN"
    ]
  },

  referralSystem: {

    enabled: true,

    verificationRequired: true,

    rewardFlow: {
      trigger: [
        "EMAIL_VERIFIED",
        "PHONE_VERIFIED"
      ],

      reward: 500,

      destination: "AFRICOIN_WALLET"
    }
  },

  aiGovernance: {

    pricingMode: "LIVE_ADMIN_MEMORY",

    allowWhatsappTraining: true,

    pricingSource: [
      "WHATSAPP_ADMIN",
      "ADMIN_DASHBOARD"
    ]
  }
};

module.exports = V11_KERNEL;
