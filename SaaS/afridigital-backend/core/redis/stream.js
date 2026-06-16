const redis = require('./client');
const KEY = 'afri:graph:stream';

class Stream {
  async append(event) {
    await redis.xadd(KEY, '*', 'data', JSON.stringify({...event, ts: Date.now()}));
  }

  async replay(limit = 100) {
    const res = await redis.xrange(KEY, '-', '+', 'COUNT', limit);
    return res.map(([id, fields]) => ({ id, event: JSON.parse(fields[1]) }));
  }
}

module.exports = new Stream();
