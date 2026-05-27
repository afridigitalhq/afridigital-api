const { push } = require("../core/queue/eventQueue");
const { afriaiMiddleware } = require("../core/middleware/afriaiMiddleware");

module.exports = async function(req, res) {
  try {

    const event = {
      type: "whatsapp_message",
      payload: req.body
    };

    // AfriAI sits BEFORE queue ingestion
    await afriaiMiddleware(event, null, async () => {
      push(event);
    });

    res.sendStatus(200);

  } catch (e) {
    console.log("webhook error", e.message);
    res.sendStatus(500);
  }
};
