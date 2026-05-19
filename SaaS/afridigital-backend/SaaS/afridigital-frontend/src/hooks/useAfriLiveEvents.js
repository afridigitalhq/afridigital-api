import { useEffect, useRef, useState } from 'react';

const WS_URL = 'wss://afridigital-api.onrender.com';

export default function useAfriLiveEvents() {
  const [events, setEvents] = useState([]);
  const buffer = useRef([]);

  useEffect(() => {
    const socket = new WebSocket(WS_URL);

    socket.onopen = () => console.log('⚡ AfriOS live stream connected');

    socket.onmessage = (msg) => {
      try {
        const event = JSON.parse(msg.data);
        buffer.current.unshift(event);
        if (buffer.current.length > 200) buffer.current.pop();
        setEvents([...buffer.current]);
      } catch (e) {}
    };

    socket.onerror = (err) => console.log('⚠️ WebSocket error', err);

    socket.onclose = () => console.log('🔌 Live stream disconnected');

    return () => socket.close();
  }, []);

  return events;
}
