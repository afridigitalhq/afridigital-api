const { StreamCore } = require("../streamCore");

/**
 * 🔌 REPLACE WITH YOUR REAL WHATSAPP API
 */
async function sendWhatsAppMessage(to, text) {
  console.log("📤 MESSAGE:", { to, text });
}

async function typingOn(to) {
  console.log("⌨️ WHATSAPP TYPING ON:", to);
}

async function typingOff(to) {
  console.log("🛑 WHATSAPP TYPING OFF:", to);
}

/**
 * STREAM → WHATSAPP BRIDGE (WITH TYPING SYNC)
 */
class WhatsAppStreamBridge {
  constructor({ userId }) {
    this.userId = userId;
    this.buffer = "";
    this.lastSentAt = 0;
    this.typing = false;
  }

  attach(streamer) {
    streamer.on("token", async (t) => {
      this.buffer += t.token + " ";

      const now = Date.now();

      // Start typing when first token arrives
      if (!this.typing) {
        this.typing = true;
        await typingOn(this.userId);
      }

      // throttle message sends
      if (now - this.lastSentAt > 900 || t.done) {
        const msg = this.buffer.trim();
        this.buffer = "";
        this.lastSentAt = now;

        if (msg.length > 0) {
          await sendWhatsAppMessage(this.userId, msg);
        }
      }
    });

    streamer.on("done", async () => {
      if (this.buffer.trim().length > 0) {
        await sendWhatsAppMessage(this.userId, this.buffer.trim());
        this.buffer = "";
      }

      if (this.typing) {
        this.typing = false;
        await typingOff(this.userId);
      }
    });
  }
}

module.exports = {
  WhatsAppStreamBridge
};
