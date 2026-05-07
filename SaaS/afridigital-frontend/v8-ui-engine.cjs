const fs = require("fs");

const cache = {
  hero: fs.readFileSync("./public/sections/hero.html", "utf-8"),
  auth: fs.readFileSync("./public/sections/auth.html", "utf-8"),
  services: fs.readFileSync("./public/sections/services.html", "utf-8"),
  marquee: fs.readFileSync("./public/sections/marquee.html", "utf-8"),
  footer: fs.readFileSync("./public/sections/footer.html", "utf-8"),
  chat: fs.readFileSync("./public/sections/chat.html", "utf-8")
};

function render(appId = "app") {
  const order = ["hero","marquee","auth","services","footer","chat"];
  const app = global.document?.getElementById(appId);

  if (!app) return;

  app.innerHTML = order.map(k => cache[k]).join("\n");
  console.log("⚡ V8 UI ENGINE RENDERED");
}

module.exports = { render };
