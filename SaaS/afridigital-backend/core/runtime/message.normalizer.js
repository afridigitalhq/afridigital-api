function normalizeMessage(payload) {

  return {
    sender:
      payload.sender || '',

    message:
      payload.message || '',

    timestamp:
      Date.now()
  };
}

module.exports = { normalizeMessage };
