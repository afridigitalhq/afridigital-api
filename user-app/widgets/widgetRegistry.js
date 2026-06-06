export const widgetRegistry = {
  wallet: null,
  jobs: null,
  services: null,
  earn: null,
  boost: null,
  social: null,
  chat: null,
  notifications: null
};

export function registerWidget(name, component) {
  widgetRegistry[name] = component;
}

export function getWidget(name) {
  return widgetRegistry[name];
}
