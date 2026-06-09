let ioRef = null;

function initRealtime(io) {
  ioRef = io;
}

function emitWhatsApp(event) {
  if (ioRef) ioRef.emit("whatsapp:event", event);
}

function emitFlow(event) {
  if (ioRef) ioRef.emit("flow:event", event);
}

module.exports = {
  initRealtime,
  emitWhatsApp,
  emitFlow
};
