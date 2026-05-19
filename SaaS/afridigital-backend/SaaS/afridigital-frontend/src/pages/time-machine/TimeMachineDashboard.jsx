import { useEffect } from "react";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";

const API_URL = "https://afridigital-api.onrender.com";

export default function TimeMachineDashboard() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const events = useEffect(() => {
    fetch('https://afridigital-api.onrender.com/api/replay/events')
      .then(r => r.json())
      .then(setEvents);
  }, []);

  const events = useMemo(() => [
    { t: 1, type: "wallet.credit", payload: { user: "U1", amount: 50 } },
    { t: 2, type: "wallet.debit", payload: { user: "U1", amount: 10 } },
    { t: 3, type: "ledger.snapshot", payload: { balance: 40 } },
    { t: 4, type: "wallet.credit", payload: { user: "U2", amount: 120 } },
    { t: 5, type: "wallet.debit", payload: { user: "U2", amount: 30 } }
  ], []);

  const visible = events.slice(0, index);

  const state = useMemo(() => {
    return visible.reduce((acc, e) => {
      if (!e.payload.user) return acc;

      if (!acc[e.payload.user]) acc[e.payload.user] = 0;

      if (e.type === "wallet.credit")
        acc[e.payload.user] += e.payload.amount;

      if (e.type === "wallet.debit")
        acc[e.payload.user] -= e.payload.amount;

      return acc;
    }, {});
  }, [visible]);

  return (
    <div className="p-6 grid gap-6">
      <h1 className="text-2xl font-bold">⏱ AfriOS Time Machine</h1>

      <Card>
        <CardContent className="flex gap-4 items-center p-4">
          <Button onClick={() => setPlaying(!playing)}>
            {playing ? <Pause /> : <Play />}
          </Button>

          <Button variant="outline" onClick={() => setIndex(0)}>
            <RotateCcw />
          </Button>

          <Slider
            value={[index]}
            min={0}
            max={events.length}
            step={1}
            onValueChange={(v) => setIndex(v[0])}
          />
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">

        <Card>
          <CardContent className="p-4">
            <h2>State Snapshot</h2>
            {Object.entries(state).map(([u, b]) => (
              <div key={u} className="flex justify-between border-b py-1">
                <span>{u}</span>
                <span>{b} coins</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2>Event Stream</h2>
            {visible.map((e, i) => (
              <motion.div
                key={i}
                className="text-sm p-2 bg-gray-100 rounded mt-2"
              >
                <div className="font-mono">{e.type}</div>
                <div className="text-gray-600">
                  {JSON.stringify(e.payload)}
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

// LIVE STREAM HOOK (add inside component)
useEffect(() => {
  const ws = new WebSocket("wss://afridigital-api.onrender.com");

  ws.onmessage = (msg) => {
    const event = JSON.parse(msg.data);

    setEvents(prev => [...prev, event]);
  };

  return () => ws.close();
}, []);
