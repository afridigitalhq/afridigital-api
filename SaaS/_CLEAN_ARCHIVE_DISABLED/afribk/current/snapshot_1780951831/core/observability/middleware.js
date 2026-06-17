const crypto = require('crypto');
const { push } = require('./store/buffer');
const { inc } = require('./metrics');

module.exports = function obs(req, res, next) {
  const start = Date.now();

  const id = req.headers['x-request-id'] || crypto.randomUUID();
  req.id = id;

  res.setHeader('x-request-id', id);

  inc();

  res.on('finish', () => {
    push({
      id,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: Date.now() - start,
      ts: new Date().toISOString()
    });
  });

  next();
};
