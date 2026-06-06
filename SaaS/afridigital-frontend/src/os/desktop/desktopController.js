import { bus } from "../bus/eventBus";
import { wm } from "./windowManager";
import { AppRegistry } from "../apps/registry";

export function initDesktopController() {

  bus.on("ui:open", ({ window }) => {
    const app = AppRegistry[window];
    if (app) wm.open(app.id, app);
  });

  bus.on("ui:close", ({ window }) => {
    wm.close(window);
  });

  bus.on("ui:focus", ({ window }) => {
    wm.focus(window);
  });

}
