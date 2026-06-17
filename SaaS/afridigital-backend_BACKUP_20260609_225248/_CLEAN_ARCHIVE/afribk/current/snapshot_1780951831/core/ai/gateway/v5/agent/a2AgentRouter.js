const engine = require('../plugins/whatsapp/a2Engine.ext');
const bridge = require('../plugins/whatsapp/a2CloudBridge');

class A2AgentRouter {

  async handle(input = {}) {
    const text = input.text || "";
    const to = input.to || "mock";

    // 1. Simple intent detection (lightweight layer)
    const intent = this._detectIntent(text);

    // 2. Route decisions
    if (intent === "send_only") {
      const result = await bridge.forward(to, text);
      return { stage: "cloud_only", result };
    }

    // 3. Default: full A2 pipeline
    const job = await engine.enqueue({ text, to });

    return {
      stage: "a2_pipeline",
      queued: true,
      job
    };
  }

  _detectIntent(text) {
    const t = text.toLowerCase();

    if (t.startsWith("send:")) return "send_only";
    if (t.includes("broadcast")) return "broadcast";
    return "a2";
  }
}

module.exports = new A2AgentRouter();
