import { useState } from "react";

export function useReplayEngine() {
  const [history, setHistory] = useState([]);

  const load = async (from = 0, to = 999999) => {
    const res = await fetch(
      "https://afridigital-api.onrender.com/api/events/history?from=" + from + "&to=" + to
    );
    const json = await res.json();
    setHistory(json.events || []);
  };

  return { history, load };
}
