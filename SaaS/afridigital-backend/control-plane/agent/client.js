const fetch = require("node-fetch");

const COLLECTOR = "http://localhost:6060/event";

async function send(event) {
  try {
    await fetch(COLLECTOR, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event)
    });
  } catch {}
}

module.exports = { send };
