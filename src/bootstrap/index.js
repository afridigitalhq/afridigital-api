import express from "express";
import { initAfriDigitalBootstrap } from "./AfriDigitalBootstrap.js";
import { registerProductRoutes } from "../api/products/routes.js";

const app = express();
const PORT = process.env.PORT || 10000;

// register APIs
registerProductRoutes(app);

const server = app.listen(PORT, () => {
  console.log("🚀 AfriDigital running on port", PORT);

  // ecosystem bootstrap
  initAfriDigitalBootstrap(server);
});
