module.exports = (req, res) => {
  res.json({
    status: "ok",
    system: "afridigital",
    timestamp: Date.now()
  });
};
