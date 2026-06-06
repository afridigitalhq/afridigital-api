import React, { useEffect, useState } from "react";
import BaseWidget from "./_BaseWidget";

export default function NotificationsWidget() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetch("https://afridigital-fmdash.onrender.com/api/notifications/demo-user")
      .then(res => res.json())
      .then(setNotes)
      .catch(() => setNotes([]));
  }, []);

  return (
    <BaseWidget title="🔔 Notifications">
      {notes.length ? (
        notes.slice(-3).map(n => (
          <div key={n.id} style={{ marginBottom: "6px" }}>
            <b>{n.title}</b>
            <div style={{ opacity: 0.7 }}>{n.message}</div>
          </div>
        ))
      ) : (
        <div>No notifications</div>
      )}
    </BaseWidget>
  );
}
