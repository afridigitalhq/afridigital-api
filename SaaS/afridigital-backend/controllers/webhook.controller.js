const queue = require('../core/bus/event.bus');

exports.handleWebhook = (req, res) => {
  res.sendStatus(200);

  require("../core/bus/event.bus").publish(req.body);
};
