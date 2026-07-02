const llm = require("./brain.v3.llm");

async function debate(message, context) {

  const agents = [
    "fraud analyst",
    "sales optimizer",
    "support assistant"
  ];

  const responses = await Promise.all(
    agents.map(a =>
      llm.reason({ role: a, context }, message)
    )
  );

  // simple judge (first version)
  const final = responses.find(r => r.length > 10) || responses[0];

  return final;
}

module.exports = { debate };
