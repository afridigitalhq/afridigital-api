module.exports = (app) => {
  try { require("./whatsapp.routes")(app); } catch {}
  try { require("./ci.routes")(app); } catch {}
  try { require("./event.routes")(app); } catch {}
};
