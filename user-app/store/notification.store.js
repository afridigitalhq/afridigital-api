import { useState } from "react";

const listeners = [];

let state = {
  notifications: []
};

export function addNotification(note) {
  state.notifications.push({
    id: Date.now(),
    ...note
  });

  listeners.forEach(fn => fn(state));
}

export function useNotifications() {
  const [data, setData] = useState(state);

  if (!listeners.includes(setData)) {
    listeners.push(setData);
  }

  return data.notifications;
}
