const { wrapResponse } = require("../conversation/response.wrapper.cjs");
const { attachAd } = require("../ads/post.response.ad.cjs");
const { handleLead } = require("../lead-router/router.cjs");

function processAI(input) {

  // 1. normal AI response
  let response = wrapResponse({
    answer: "AI processed request successfully",
    context: input.context
  });

  // 2. check for high-value leads
  const lead = handleLead(input.text);
  if (lead.routed) return lead;

  // 3. attach monetization layer
  response = attachAd(response, input.context);

  return response;
}

module.exports = { processAI };
