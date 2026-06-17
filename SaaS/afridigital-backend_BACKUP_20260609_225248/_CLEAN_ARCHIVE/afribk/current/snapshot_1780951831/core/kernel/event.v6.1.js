
const infra = require('./infra.adapter.v6.1');

async function emit(event) {
  return infra.emit('afri:event', event);
}

module.exports = { emit };

