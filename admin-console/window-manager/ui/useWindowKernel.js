import { useEffect, useState } from "react";

/**
 * 🧠 React hook for window kernel state
 */
export function useWindowKernel(socket) {

  const [windows, setWindows] = useState({});

  useEffect(() => {

    socket.emit("WINDOW_STATE_REQUEST");

    socket.on("WINDOW_STATE", (state) => {
      setWindows(state.windows);
    });

    return () => socket.off("WINDOW_STATE");

  }, []);

  return windows;
}
