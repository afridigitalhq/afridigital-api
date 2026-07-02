import registerRoutes from "./routes.js";

export default function apiGateway(app) {
  registerRoutes(app);
}
