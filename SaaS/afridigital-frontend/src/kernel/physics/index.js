import { windowPhysics } from "./windowPhysics.js";
import { snapGrid } from "./snapGrid.js";
import { zIndexManager } from "./zIndexManager.js";

export const physicsEngine = {
  init() {
    windowPhysics.init();
    snapGrid.init();
    zIndexManager.init();
  }
};
