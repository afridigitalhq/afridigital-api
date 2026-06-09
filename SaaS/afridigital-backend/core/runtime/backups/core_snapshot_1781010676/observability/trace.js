const { findById } = require('./store/buffer');

function traceHandler(req, res) {
  const id = req.params.id;
  res.json({
    traceId: id,
    events: findById(id)
  });
}

module.exports = traceHandler;
