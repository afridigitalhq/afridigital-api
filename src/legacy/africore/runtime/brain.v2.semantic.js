const brain = require("./brain.v2.memory");

// lightweight semantic tagging (no heavy ML yet)
function extractTags(text) {
  const tags = [];

  if (/price|cost|how much/i.test(text)) tags.push("sales");
  if (/help|error|issue/i.test(text)) tags.push("support");
  if (/hack|attack|fraud/i.test(text)) tags.push("fraud");
  if (/buy|order|subscribe/i.test(text)) tags.push("conversion");

  return tags;
}

async function updateSemantic(user, text) {
  const tags = extractTags(text);

  if (tags.length > 0) {
    await brain.updateProfile(user, {
      tags
    });
  }

  return tags;
}

module.exports = { extractTags, updateSemantic };
