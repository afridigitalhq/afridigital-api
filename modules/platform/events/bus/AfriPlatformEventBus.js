import eventBus from "../../../../core/eventbus/index.js";

const AfriPlatformEventBus = {
  publish(event, payload = {}) {
    eventBus.emit(event, payload);

    return {
      event,
      payload,
      status: "PUBLISHED"
    };
  },

  subscribe(event, handler) {
    eventBus.on(event, handler);

    return {
      event,
      status: "SUBSCRIBED"
    };
  }
};

export default AfriPlatformEventBus;
