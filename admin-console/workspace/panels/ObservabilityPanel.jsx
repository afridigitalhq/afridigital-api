import React, { useEffect, useState } from "react";

/**
 * 📊 SYSTEM OBSERVABILITY GRID
 */

export default function ObservabilityPanel({ socket }) {

  const [events, setEvents] = useState([]);

  useEffect(() => {

    socket.on("TRACE", (e) => {
      setEvents(prev => [e, ...prev].slice(0, 30));
    });

  }, []);

  return (
    <div style={{ padding: 10 }}>
      <h3>📊 Observability</h3>

      <table style={{ width: "100%", fontSize: 12 }}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Trace</th>
          </tr>
        </thead>

        <tbody>
          {events.map((e, i) => (
            <tr key={i}>
              <td>{e.type}</td>
              <td>{e.traceId}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}
