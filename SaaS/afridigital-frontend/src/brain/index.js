import AfriBrainCortex from "./AfriBrainCortex";

const canvas = document.getElementById("brain");

AfriBrainCortex(
  canvas,
  "wss://afridigital-api.onrender.com/flow"
);
