export function attachDagStream(socket, onUpdate) {
  if (!socket) return;

  socket.on("dag:event", (payload) => {
    onUpdate?.(payload?.nodes || []);
  });

  socket.on("connect", () => {
    socket.emit("dag:subscribe", { scope: "admin" });
  });
}
