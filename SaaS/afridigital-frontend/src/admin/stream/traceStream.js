export function createTraceStream(onEvent) {
  const es = new EventSource("/trace");

  es.onmessage = (msg) => {
    try {
      onEvent(JSON.parse(msg.data));
    } catch (e) {}
  };

  es.onerror = () => {
    console.log("trace stream disconnected");
  };

  return es;
}
