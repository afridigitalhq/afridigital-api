import { AfriProducts } from "../../bootstrap/registry/ProductRegistry.js";

export function registerProductRoutes(app){

  // Full product list
  app.get("/api/products", (req, res) => {
    res.json({
      success: true,
      count: AfriProducts.length,
      data: AfriProducts
    });
  });

  // Sidebar (user)
  app.get("/api/products/sidebar/user", (req, res) => {
    res.json(AfriProducts.map(p => ({ key: p.key })));
  });

  // Sidebar (admin)
  app.get("/api/products/sidebar/admin", (req, res) => {
    res.json(AfriProducts.map(p => ({ key: p.key, access: "ADMIN_FULL" })));
  });

  console.log("📦 Product API routes registered");
}
