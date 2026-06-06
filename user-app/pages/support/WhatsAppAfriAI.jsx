import React from "react";

export default function WhatsAppAfriAI() {

  const phoneNumber = "2347060553158"; // AfriAI WhatsApp number

  const openWhatsApp = () => {

    const url = `https://wa.me/${phoneNumber}?text=Hello%20AfriAI%2C%20I%20need%20help%20with%20AfriDigital`;

    window.open(url, "_blank");
  };

  return (
    <div style={{
      padding: 20,
      background: "#050a18",
      color: "#0ff",
      minHeight: "100vh"
    }}>

      <h1>💬 Chat with AfriAI</h1>

      <p>
        Connect directly to AfriAI on WhatsApp for help, guidance, or automation support.
      </p>

      <button
        onClick={openWhatsApp}
        style={{
          padding: 12,
          background: "#00ff99",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        🚀 Open WhatsApp AfriAI
      </button>

    </div>
  );
}
