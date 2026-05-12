module.exports = (app, engine) => {

  // =========================
  // META WEBHOOK VERIFY
  // =========================
  app.get("/webhook", (req, res) => {

    try {

      const VERIFY_TOKEN =
        process.env.WHATSAPP_VERIFY_TOKEN ||
        "afri_ai_2026_secure";

      const mode =
        req.query["hub.mode"];

      const token =
        req.query["hub.verify_token"];

      const challenge =
        req.query["hub.challenge"];

      if (
        mode === "subscribe" &&
        token === VERIFY_TOKEN
      ) {
        return res
          .status(200)
          .send(String(challenge));
      }

      return res.sendStatus(403);

    } catch (err) {

      console.log(
        "[WEBHOOK GET ERROR]",
        err.message
      );

      return res.sendStatus(500);

    }

  });

  // =========================
  // META MESSAGE RECEIVE
  // =========================
  app.post("/webhook", (req, res) => {

    res.sendStatus(200);

    try {

      const msg =
        req.body?.entry?.[0]
        ?.changes?.[0]
        ?.value?.messages?.[0];

      if (!msg) {
        console.log("[NO MESSAGE]");
        return;
      }

      const from = msg.from;

      const text =
        msg.text?.body || "";

      console.log(
        "[WHATSAPP IN]",
        from,
        text
      );

      engine.enqueue({
        from,
        text: String(text).slice(0, 2000)
      });

    } catch (err) {

      console.log(
        "[WEBHOOK POST ERROR]",
        err.message
      );

    }

  });

};
