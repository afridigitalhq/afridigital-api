import { createDagStream } from "./dagStreamClient";

export function bindDagStream(socket, { onNodes }) {
  const stream = createDagStream(socket);

  stream.onEvent((event) => {
    if (!event) return;
    if (event.nodes && onNodes) onNodes(event.nodes);
  });

  return stream;
}
