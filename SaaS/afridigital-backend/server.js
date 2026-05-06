const express = require("express");
const fs = require("fs");
const path = require("path");

const whatsappRoutes = require("./routes/whatsapp");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ JSON parser (required for POST body)
app.use(express.json());

// ✅ API routes
app.use("/api", whatsappRoutes);

const load = (file) =>
  fs.readFileSync(path.join(__dirname, "views/partials", file), "utf8");

// 🚀 Outbound gateway
app.get("/go/:service", (req, res) => {
  const map = {
    hfm: "https://hfmarkets.co.uk/en/?refid=YOUR_ID"
  };

  const s = req.params.service;

  if (map[s]) {
    console.log("OUTBOUND", s, req.ip, Date.now());
    return res.redirect(map[s]);
  }

  return res.status(404).send("Unknown service");
});

// 🧩 UI COMPOSER
app.get("/", (req, res) => {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>AfriDigital</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    ${load("hero.html")}
    ${load("marquee.html")}
    ${load("auth.html")}
    ${load("services.html")}
    ${load("footer.html")}
    ${load("chat.html")}
  </body>
  </html>
  `;
  res.send(html);
});

app.listen(PORT, () => {
  console.log("AfriDigital API running on port", PORT);
});
