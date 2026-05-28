module.exports = async function(req, res) {
  console.log("📩 WEBHOOK RECEIVED (CLEAN MODE)");
  console.log(req.body || {});

  return res.sendStatus(200);
};
