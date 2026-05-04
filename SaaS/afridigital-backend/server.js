const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
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
html{font-size:18px}
body{margin:0;padding:0;width:100%;overflow-x:hidden;font-family:ui-sans-serif,system-ui;}
section{width:100%;}
.container{max-width:1200px;margin:0 auto;padding:0 24px;}
h1{font-size:3.2rem !important;line-height:1.1}
h2{font-size:1.9rem !important;line-height:1.2}
p{font-size:1.05rem;line-height:1.6}
.hero{width:100%;min-height:80vh}
.max-w-xl{max-width:42rem !important}
.max-w-4xl{max-width:72rem !important}
footer{padding-top:3rem;padding-bottom:3rem;border-top:1px solid #1f2937}
.animate-scroll{font-size:1.05rem;letter-spacing:0.02em}
.chat-widget{position:fixed;bottom:20px;right:20px;z-index:9999}
</style>
    <meta charset="UTF-8" />
    <title>AfriDigital</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-gray-50 text-gray-900 leading-relaxed tracking-tight">
<div class="min-h-screen max-w-6xl mx-auto px-4">

    ${load("hero.html")}
    ${load("marquee.html")}
    ${load("auth.html")}
    ${load("services.html")}
    ${load("footer.html")}
    ${load("chat.html")}

  </div></div></div></body>
  </html>
  `;

  res.send(html);
});

app.listen(PORT, () => {
  console.log("AfriDigital UI Engine running on port", PORT);
});
