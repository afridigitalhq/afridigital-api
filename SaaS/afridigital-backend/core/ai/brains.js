const { assertApiVersion } = require("../runtime/safety/api.guard");
exports.brains = {
  greet: (text) => "Hello 👋 I’m AfriAI. How can I help you today?",
  pricing: () => "💰 Our pricing is flexible based on usage.",
  sales: () => "🛒 I can help you place an order or guide you.",
  support: () => "🛠️ Tell me your issue and I’ll assist you.",
  default: (text) => "I understand. Let me process that for you 🤖"
};
