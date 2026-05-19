import './src/styles/design-system.css'
const app = document.getElementById("app");
const sections = ["hero","marquee","auth","services","footer","chat-widget"];

async function loadSections() {
  try {
    const htmlParts = await Promise.all(
      sections.map(sec => fetch(`/sections/${sec}.html`).then(r => r.text()))
    );
    app.innerHTML = htmlParts.join("\n");
    console.log("🔥 Sections loaded");
  } catch(e) {
    console.error("❌ Error loading sections:", e);
  }
}

loadSections();
import './live-css-inject.js';
import './src/live-css-inject.js';
