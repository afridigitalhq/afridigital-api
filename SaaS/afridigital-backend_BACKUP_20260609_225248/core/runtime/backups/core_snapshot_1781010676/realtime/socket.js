const { Server } = require("socket.io");

let io;

function attachSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  io.on("connection", (socket) => {
    console.log("📡 Admin dashboard connected:", socket.id);

    socket.emit("system:event", {
      status: "connected",
      service: "afridigital-realtime"
    });
  });

  return io;
}

function getIO() {
  return io;
}

module.exports = {
  attachSocket,
  getIO
};
