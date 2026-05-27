module.exports = async function(req, res) {
  try {
    console.log("📩 WEBHOOK RECEIVED:", req.body);

    // SAFE MODE: just acknowledge
    return res.sendStatus(200);

  } catch (e) {
    console.log("webhook error:", e.message);
    return res.sendStatus(500);
  }
};
