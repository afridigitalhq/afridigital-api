import express from "express";

export function mountPublic(app){
  app.use(express.json());

  app.get("/", (_, res) => {
    res.json({
      status: "AfriDigital API live 🚀",
      runtime: "ESM"
    });
  });

  app.get("/api/soc", (_, res) => {
    res.json({
      status: "SOC active",
      modules: [
        "kernel",
        "events",
        "intelligence",
        "ci"
      ]
    });
  });
}
