function ingest(msg) {
  return {
    from: msg.from,
    text: msg.text || '',
    ts: Date.now()
  };
}

module.exports = { ingest };
