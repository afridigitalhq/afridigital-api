module.exports = (req, channel) => ({
  channel,
  userId: req.body?.from || req.body?.userId || 'anonymous',
  message: req.body?.text || req.body?.message || '',
  meta: req.body || {}
});
