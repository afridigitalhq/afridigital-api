import React, { useEffect, useState } from "react";
import { generateFeed } from "../../lib/feed.engine";

const mockItems = [
  { id: 1, title: "Find Jobs Near You", category: "jobs", baseScore: 10 },
  { id: 2, title: "Promote Your Business", category: "boost", baseScore: 8 },
  { id: 3, title: "Hire Freelancers", category: "services", baseScore: 9 },
  { id: 4, title: "Earn by Completing Tasks", category: "earn", baseScore: 7 },
  { id: 5, title: "Social Growth Tools", category: "social", baseScore: 6 },
  { id: 6, title: "Wallet Rewards System", category: "wallet", baseScore: 5 }
];

export default function MarketplaceFeed({ userId = "guest" }) {
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const ranked = generateFeed(mockItems, userId);
    setFeed(ranked);
  }, [userId]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

      <h3>🧠 Your Adaptive Marketplace</h3>

      {feed.map(item => (
        <div
          key={item.id}
          style={{
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: item.score > 100
              ? "rgba(0,229,255,0.08)"
              : "rgba(255,255,255,0.03)"
          }}
        >
          <b>{item.title}</b>

          <div style={{ fontSize: "12px", opacity: 0.6 }}>
            category: {item.category} | score: {item.score}
          </div>

          {item.score > 120 && (
            <span style={{
              fontSize: "11px",
              color: "#00e5ff"
            }}>
              🔥 Recommended for you
            </span>
          )}
        </div>
      ))}

    </div>
  );
}
