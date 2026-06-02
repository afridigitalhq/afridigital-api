export function attachTimeSocket(socket, renderer) {

  socket.emit("TIMELINE_SUBSCRIBE");

  socket.on("TIMELINE_STREAM", (event) => {
    renderer.ingest(event);
  });

}
