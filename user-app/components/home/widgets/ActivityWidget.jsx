import React, { useEffect, useState } from "react";
import BaseWidget from "./_BaseWidget";

export default function ActivityWidget() {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    fetch("https://afridigital-fmdash.onrender.com/api/activity/demo-user")
      .then(res => res.json())
      .then(setActivity)
      .catch(() => setActivity([]));
  }, []);

  return (
    <BaseWidget title="📊 Activity">
      {activity.length ? (
        activity.slice(-5).map(a => (
          <div key={a.id} style={{ marginBottom: "6px" }}>
            <b>{a.action}</b>
            <div style={{ opacity: 0.6 }}>
              {new Date(a.timestamp).toLocaleString()}
            </div>
          </div>
        ))
      ) : (
        <div>No activity yet</div>
      )}
    </BaseWidget>
  );
}
