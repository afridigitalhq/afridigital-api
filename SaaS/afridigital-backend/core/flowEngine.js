let nodes = ["API", "Kernel", "EventBus", "AI Brain", "Database"];
let index = 0;

function generateEvent() {
  const node = nodes[index % nodes.length];

  const event = {
    id: "evt_" + Date.now(),
    node,
    action: "execute",
    status: "running",
    timestamp: Date.now()
  };

  index++;

  return event;
}

module.exports = { generateEvent };
