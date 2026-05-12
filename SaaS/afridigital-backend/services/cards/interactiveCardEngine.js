const { assertApiVersion } = require("../runtime/safety/api.guard");
const axios = require('axios');

class InteractiveCardEngine {

  async send(payload) {

    const token =
      process.env.WHATSAPP_TOKEN;

    const phoneId =
      process.env.WHATSAPP_PHONE_NUMBER_ID;

    const url =
      `graph("")${phoneId}/messages`;

    try {

      const res = await axios.post(
        url,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      return res.data;

    } catch (err) {

      console.error(
        "❌ WhatsApp Card Error:",
        err.response?.data || err.message
      );

      return null;
    }
  }

  async sendWelcomeCard(to) {

    return this.send({
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "button",
        header: {
          type: "text",
          text: "💎 AfriDigital"
        },
        body: {
          text:
`Welcome to AfriDigital 🚀

Earn Acoin, promote your business, and complete online opportunities directly inside WhatsApp.`
        },
        footer: {
          text: "1 Acoin = ₦10"
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "earn_jobs",
                title: "Earn Acoin"
              }
            },
            {
              type: "reply",
              reply: {
                id: "boost_business",
                title: "Promote Biz"
              }
            },
            {
              type: "reply",
              reply: {
                id: "wallet",
                title: "Wallet"
              }
            }
          ]
        }
      }
    });

  }

  async sendTaskCard(to) {

    return this.send({
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "button",
        header: {
          type: "text",
          text: "💼 New Earning Task"
        },
        body: {
          text:
`Follow a business page and upload screenshot proof.

💰 Reward: 25 Acoin
📎 Proof Required: Screenshot`
        },
        footer: {
          text: "AfriDigital Tasks"
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "accept_task",
                title: "Accept"
              }
            },
            {
              type: "reply",
              reply: {
                id: "skip_task",
                title: "Skip"
              }
            }
          ]
        }
      }
    });

  }

  async sendAdCard(to) {

    return this.send({
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "button",
        header: {
          type: "text",
          text: "📢 Sponsored Opportunity"
        },
        body: {
          text:
`Boost your business to active WhatsApp users 🚀

Reach real people and grow faster with AfriDigital Ads.`
        },
        footer: {
          text: "Sponsored"
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "start_boost",
                title: "Boost Now"
              }
            },
            {
              type: "reply",
              reply: {
                id: "learn_more",
                title: "Learn More"
              }
            }
          ]
        }
      }
    });

  }

  async sendWalletCard(to) {

    return this.send({
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "button",
        header: {
          type: "text",
          text: "💎 AfriDigital Wallet"
        },
        body: {
          text:
`💵 External Balance: ₦5,000
🪙 Acoin Balance: 500 Acoin
🔒 Escrow: 120 Acoin

🔁 Rate: 1 Acoin = ₦10`
        },
        footer: {
          text: "Active Earning Profile 🚀"
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "withdraw",
                title: "Withdraw"
              }
            },
            {
              type: "reply",
              reply: {
                id: "convert",
                title: "Convert"
              }
            }
          ]
        }
      }
    });

  }

}

module.exports = new InteractiveCardEngine();
