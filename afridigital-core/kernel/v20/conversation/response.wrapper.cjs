function wrapResponse({ answer, context }) {

  const response = {
    answer,
    timestamp: Date.now(),
    monetization: null
  };

  return response;
}

module.exports = { wrapResponse };
