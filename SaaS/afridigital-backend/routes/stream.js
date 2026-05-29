const { createStream } = require('../core/stream/emitter');
const { runStreamBrain } = require('../core/ai/streamBrain');

module.exports = (app) => {

  app.get('/stream', async (req, res) => {

    const stream = createStream(res);

    const payload = {
      from: req.query.from || "anonymous",
      text: req.query.text || ""
    };

    try {
      await runStreamBrain(payload, stream);
      stream.close();
    } catch (err) {
      stream.send("error", { message: err.message });
      stream.close();
    }
  });

};
