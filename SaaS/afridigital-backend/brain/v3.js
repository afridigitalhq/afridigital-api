async function processMessage({ body }) {

  const text = (body.message || "").toLowerCase();

  let reply = "🤖 AfriAI received your message.";

  if (text.includes("hello") || text.includes("hi")) {
    reply = "Hey 👋 Welcome to AfriAI.";
  }

  else if (text.includes("help")) {
    reply = "🛠 Support is available. Tell me your issue.";
  }

  else if (text.includes("pricing")) {
    reply = "💳 Our pricing plans will be available shortly.";
  }

  else if (text.includes("who are you")) {
    reply = "⚡ I am AfriAI, your WhatsApp assistant.";
  }

  return { reply };
}

module.exports = { processMessage };
