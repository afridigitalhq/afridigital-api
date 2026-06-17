const bus = require("../../core/redis/streamBus");
const { setReply } = require("../../core/africore/runtime/promiseStore");

const STREAM = "afri:whatsapp:stream";

function handler(event) {
  const { traceId, text } = event;

  console.log("⚡ PROCESSING:", traceId);

  const result = {
    reply: "💬 Message received",
    echo: text
  };

  setReply(traceId, result);
}

function start() {
  bus.subscribe(STREAM, handler);
  console.log("🚀 EVENT WORKER RUNNING");
}

start();
