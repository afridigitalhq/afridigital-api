const { requeue } = require("./eventQueue");

function handleFailure(event, err){
  if(!event) return;
  console.log("🔁 retry:", err.message);
  if((event.retries||0) < 3) requeue(event);
}

module.exports = { handleFailure };
