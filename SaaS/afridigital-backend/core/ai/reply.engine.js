const { assertApiVersion } = require("../runtime/safety/api.guard");
const memory = require('../../storage/memory.store');
const router = require('./intelligence.router');
const { brains } = require('./brains');

exports.generateReply = async (text, userId = 'default') => {
  const intent = router.routeIntent(text);

  console.log("🧠 INTENT DETECTED:", intent);

  memory.append(userId, { role: 'user', text, intent });

  const history = memory.get(userId).history;

  const reply = brains[intent](text);

  memory.append(userId, { role: 'ai', text: reply });

  return reply;
};
