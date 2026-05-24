const campaign = require("./campaign.engine");

async function segmentUser(msg, intentScore) {
  if (intentScore > 0.8) {
    await campaign.addToSegment("hot-leads", msg.from);
  } else if (intentScore > 0.5) {
    await campaign.addToSegment("warm-leads", msg.from);
  } else {
    await campaign.addToSegment("cold-leads", msg.from);
  }
}

module.exports = { segmentUser };
