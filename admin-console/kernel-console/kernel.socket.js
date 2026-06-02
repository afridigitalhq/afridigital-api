export function attachKernelConsole(socket) {

  socket.emit("KERNEL_INIT");

  socket.on("KERNEL_STATE", (state) => {
    console.log("Kernel state:", state);
  });

  socket.on("TRACE", (trace) => {
    console.log("Trace:", trace.type);
  });

}
