function execute(lane, text) {

  if (lane === 'FAST') {
    return { reply: '⚡ FAST response' };
  }

  if (lane === 'FINANCE') {
    return { reply: '💰 FINANCE secure flow' };
  }

  return { reply: '📊 ANALYTICS response' };
}

module.exports = { execute };
