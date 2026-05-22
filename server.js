require("dotenv").config();
process.on("uncaughtException",e=>console.log("🔥",e)); process.on("unhandledRejection",e=>console.log("🔥",e));
process.on("uncaughtException", e => console.log("🔥 CRASH:", e)); process.on("unhandledRejection", e => console.log("🔥 REJECT:", e));
process.on("uncaughtException", err => console.error("🛑 UNCUGHT:", err)); process.on("unhandledRejection", err => console.error("🛑 PROMISE:", err));
global.__V20__ = require("./afridigital-core/kernel/v20/v20.runtime.cjs");
require('./afridigital-core/kernel/fraud/fraud.observer.wire.cjs')();
require('./afridigital-core/kernel/fraud/fraud.pipeline.wire.cjs')();
const fraudControl=require("./afridigital-core/kernel/fraud/fraud.control.cjs");
const eventStream = require("./bootstrap/event.stream.bridge.cjs");
require('./bootstrap/env.load.cjs');
const adminEvents = require('./afridigital-core/kernel/api/admin.events.api.cjs');
const attachWS = require('./bootstrap/ws.attach.cjs');
const eventTracesRoute = require('./routes/events/traces.route');
/**
 * MAIN APPLICATION SERVER
 * (All runtime logic must start here or downstream)
 */

console.log("🚀 AfriDigital Server Booting...");

// Example safe import boundary (now protected by bootstrap)
const express = require("express");
const app = express();

app.get("/", (req, res) => {

  res.json({
    status: "OK",
    system: "AfriDigital Locked Runtime",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ Server running on port", PORT);
});


// attach websocket stream
const http = require('http');
const server = http.createServer(app);
eventStream.init(server);
// __AFRI_LISTEN_FIXED
module.exports = server;


attachWS(server);


app.get('/payment-graph', (req, res) => {
  const graph = require('./afridigital-core/kernel/visualizers/payment.graph.cjs');
  res.json(graph.getGraph());
});



adminEvents(app);


const httpServer = server;
eventStream.init(httpServer);

console.log('🔐 ADMIN CONFIG:', {
  whatsapp: process.env.ADMIN_WHATSAPP,
  email: process.env.ADMIN_EMAIL
});

console.log('🟢 AFRI BOOT OK - SERVER STARTING');

fraudControl.start();




// ===============================
// 🚀 V20 MESH WIRING (AUTO-ATTACH)
// ===============================

const WhatsAppMesh = require('./afridigital-core/kernel/v20/whatsapp-mesh.cjs');
const WhatsAppSenderLoop = require('./afridigital-core/kernel/v20/sender.loop.cjs');

// create shared runtime instances
const mesh = new WhatsAppMesh(require('./afridigital-core/kernel/fraud/fraud.engine.cjs'));
const sender = new WhatsAppSenderLoop();

// START V20 PIPELINE
(async () => {
  try {
    await mesh.connect();
    console.log("🧠 V20 Mesh Connected");

    // start worker (non-blocking)
    mesh.startWorker().catch(err =>
      console.log("❌ Mesh Worker Error:", err.message)
    );

    // start sender loop (non-blocking)
    sender.start().catch(err =>
      console.log("❌ Sender Loop Error:", err.message)
    );

    console.log("🚀 V20 FULL PIPELINE ACTIVE");
  } catch (e) {
    console.log("❌ V20 INIT FAILED:", e.message);
  }
})();





app.get("/health", (_, res) => {
  res.json({
    ok: true,
    uptime: process.uptime(),
    timestamp: Date.now()
  });
});


app.post("/afri/test-ai", async (req, res) => {
  try {
    const input = req.body?.message || "hello";

    const fraudEngine = require("./afridigital-core/kernel/fraud/fraud.engine.cjs");

    const result = await fraudEngine.analyze({
      event: input,
      payload: { user: "test-user" }
    });

    res.json({ input, result });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


app.use(express.json());


app.post("/afri/debug", (req, res) => {
  res.json({
    headers: req.headers,
    body: req.body || null
  });
});


// ===============================
// 🧪 WHATSAPP LOOP SIMULATION MODE
// ===============================

const fakeInbox = [];
const fakeOutbox = [];

// simulate incoming message endpoint
app.post("/wa/simulate-inbox", async (req, res) => {
  const msg = {
    user: req.body?.user || "+234test",
    text: req.body?.text || "hello"
  };

  fakeInbox.push(msg);

  // process immediately using fraud engine
  const fraud = require("./afridigital-core/kernel/fraud/fraud.engine.cjs");

  const result = await fraud.analyze({
    event: msg.text,
    payload: { user: msg.user }
  });

  const response = {
    to: msg.user,
    reply: result.action === "ALLOW"
      ? "Message received ✔"
      : "Message flagged ⚠",
    score: result.score
  };

  fakeOutbox.push(response);

  res.json({ inbox: msg, processed: result, outbox: response });
});

app.get("/wa/outbox", (_, res) => {
  res.json(fakeOutbox);
});


// ===============================
// 📡 WHATSAPP CLOUD WEBHOOK
// ===============================

app.use(express.json());

// VERIFY webhook (Meta requirement)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === process.env.META_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// RECEIVE messages from WhatsApp
app.post("/webhook", async (req, res) => {
  try {
    const entry = req.body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;

    const message = value?.messages?.[0];
    if (!message) return res.sendStatus(200);

    const from = message.from;
    const text = message?.text?.body || "hello";

    // AI engine
    const fraudEngine = require("./afridigital-core/kernel/fraud/fraud.engine.cjs");

    const result = await fraudEngine.analyze({
      event: text,
      payload: { user: from }
    });

    const reply =
      result.action === "ALLOW"
        ? `✔ Received: ${text}`
        : `⚠ Message flagged`;

    // send reply
    await sendWhatsAppMessage(from, reply);

    res.sendStatus(200);

  } catch (e) {
    console.log("WEBHOOK ERROR:", e.message);
    res.sendStatus(200);
  }
});

// ===============================
// 📤 WHATSAPP SEND FUNCTION
// ===============================

async function sendWhatsAppMessage(to, message) {
  try {
    const fetch = require("node-fetch");

    await fetch(
      `https://graph.facebook.com/v19.0/${process.env.META_PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: message }
        })
      }
    );
  } catch (e) {
    console.log("SEND ERROR:", e.message);
  }
}

