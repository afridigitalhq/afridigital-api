const bus = require("../events/bus");

/**
 * 🟣 STREAMING LLM WRAPPER (SIMULATED TOKEN STREAM)
 * Later replace with real OpenAI stream API
 */

async function streamLLM({ role, prompt, user, agent }) {

  const response = `[${role}] processed: ${prompt}`;

  const tokens = response.split(" ");

  for (const token of tokens) {

    await new Promise(r => setTimeout(r, 40));

    await bus.publish("token", {
      user,
      agent,
      token: token + " "
    });
  }

  return response;
}

module.exports = { streamLLM };
