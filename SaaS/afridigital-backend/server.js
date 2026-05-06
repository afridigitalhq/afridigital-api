const express = require("express");
const whatsappRoutes = require("./routes/whatsapp");
const bodyParser = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

const load = (file) =>
  fs.readFileSync(path.join(__dirname, "views/partials", file), "utf8");

// 🚀 Outbound gateway (your monetization layer)
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
<style>
html{font-size:16px}
body{margin:0;padding:0;width:100%;overflow-x:hidden;font-family:ui-sans-serif,system-ui;background:#0b1220;color:#e5e7eb;}
.container{max-width:1200px;margin:0 auto;padding:0 24px;}
.hero{min-height:85vh}
h1{line-height:1.1}
h2{line-height:1.2}
p{line-height:1.6}
</style>

<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">



    <meta charset="UTF-8" />
    <title>AfriDigital</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-gray-50 text-gray-900 leading-relaxed tracking-tight">


    ${load("hero.html")}
    ${load("marquee.html")}
    ${load("auth.html")}
    ${load("services.html")}
    ${load("footer.html")}
    ${load("chat.html")}

  </div></div></body>
  </html>
  `;

  res.send(html);
});

app.use("/api", whatsappRoutes);
app.listen(PORT, () => {
  console.log("AfriDigital UI Engine running on port", PORT);
});
