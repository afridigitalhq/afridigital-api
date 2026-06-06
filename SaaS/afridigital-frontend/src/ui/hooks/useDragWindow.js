import { useRef } from "react";

export function useDragWindow(onMove) {
  const ref = useRef(null);

  const startDrag = (e) => {
    const startX = e.clientX;
    const startY = e.clientY;

    const rect = ref.current.getBoundingClientRect();

    function move(ev) {
      onMove({
        x: rect.left + (ev.clientX - startX),
        y: rect.top + (ev.clientY - startY)
      });
    }

    function stop() {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", stop);
    }

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", stop);
  };

  return { ref, startDrag };
}
