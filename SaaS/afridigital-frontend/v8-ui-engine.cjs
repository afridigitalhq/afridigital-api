function REAL_RENDER() {
  const app = typeof document !== "undefined"
    ? document.getElementById("app")
    : null;

  if (!app) {
    console.log("🧠 REAL_RENDER (no DOM available)");
    return;
  }

  app.innerHTML = `
    <div style="padding:20px;font-family:sans-serif">
      <h1>AfriDigital V8</h1>
      <p>Clean Engine Mode Restored</p>
    </div>
  `;

  console.log("🧠 REAL_RENDER ACTIVE (CLEAN STATE)");
}

module.exports = { REAL_RENDER };
