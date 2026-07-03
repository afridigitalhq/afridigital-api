import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const fraudEngine = require("../engine/fraud.engine.cjs");

export default function webhookGateway(app) {

  app.post("/webhook", async (req, res) => {
    try {
      const result = await fraudEngine(req.body);

      return res.json({
        ok: true,
        result
      });

    } catch (err) {
      return res.status(500).json({
        ok: false,
        error: err.message
      });
    }
  });

}
