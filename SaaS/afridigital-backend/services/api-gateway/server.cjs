require("dotenv").config({ path: require("path").resolve(__dirname, "../../../../.env"), override: true });
require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

app.get("/", (_, res) => {
  res.json({
    status: "AFRIDIGITAL V30 ONLINE",
    frontend: process.env.FRONTEND_URL,
    backend: process.env.API_URL,
    render: process.env.API_URL
  });
});

app.get("/health", (_, res) => {
  res.json({
    ok: true,
    ts: Date.now()
  });
});

app.listen(process.env.PORT, () => {
  console.log(`🌐 API Gateway Running : ${process.env.PORT}`);
});
