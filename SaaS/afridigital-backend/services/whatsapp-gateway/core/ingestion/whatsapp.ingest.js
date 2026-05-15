function ingest(body) {
  return {
    from: body?.from || 'unknown',
    text: body?.text || '',
    ts: Date.now()
  };
}

module.exports = { ingest };
