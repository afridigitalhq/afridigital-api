
function afriaiChannel(ws, kernel) {
  return (event) => {
    const result = kernel.core.dispatch({
      type: "AFRIAI_EVENT",
      payload: event
    });

    ws.send(JSON.stringify({
      type: "afriai.stream",
      result
    }));
  };
}

module.exports = { afriaiChannel };
