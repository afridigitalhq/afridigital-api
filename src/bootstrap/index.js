import apiGateway from "../api/gateway/index.js";
import { initEvents } from "./events.plugin.js";
import { startLegacy } from "./legacy.loader.js";
import { probeKernel } from "./kernel.probe.js";
import express from "express";

const app = express();
app.use(express.json());
apiGateway(app);

app.get("/", (_, res) => {
  res.json({ status: "BOOT OK", mode: "HYBRID SAFE" });
});

app.get("/api/soc", (_, res) => {
  res.json({
    status: "SOC ONLINE",
    mode: "safe-layer"
  });
});

async function bootstrap() {
  startLegacy();
initEvents();
  await probeKernel();

  const PORT = process.env.PORT || 10000;

  app.listen(PORT, () => {
    console.log("🚀 AfriDigital running on port", PORT);
  });
}

bootstrap();
