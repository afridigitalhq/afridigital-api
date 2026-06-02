import { useEffect, useState } from "react";

export function useCockpit() {
  const [state, setState] = useState({
    health: null,
    events: [],
    timestamp: Date.now()
  });

  useEffect(() => {
    async function fetchHealth() {
      try {
        const res = await fetch("/system/health");
        const data = await res.json();

        setState(s => ({
          ...s,
          health: data,
          timestamp: Date.now()
        }));
      } catch (e) {}
    }

    fetchHealth();
    const t = setInterval(fetchHealth, 3000);

    return () => clearInterval(t);
  }, []);

  return state;
}
