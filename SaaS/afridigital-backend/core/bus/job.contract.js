exports.normalize = (payload) => {
  return {
    id: Date.now() + Math.random(),
    timestamp: Date.now(),
    event: payload,
    retries: 0,
    status: "pending"
  };
};
