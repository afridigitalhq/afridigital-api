/**
 * 🧠 Cockpit live bridge
 */
export function attachCockpit(socket, setHealth) {

  socket.emit("COCKPIT_SUBSCRIBE");

  socket.on("SYSTEM_HEALTH", (h) => {
    setHealth(h);
  });

  socket.on("TRACE", (t) => {
    // passive stream only
    console.log("TRACE:", t.type);
  });

}
