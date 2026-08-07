/**
 * AfriDesign Layers Panel
 *
 * Purpose:
 * Displays the canvas layer hierarchy.
 *
 * Rule:
 * UI composition only.
 */

import { useEffect, useState } from "react";
import LayerItem from "./LayerItem";
import LayersController from "../../../layers/LayersController";
import LayerSelectionBridge from "../../../layers/LayerSelectionBridge";
import WorkspaceEventBus from "../../../runtime/events/WorkspaceEventBus";
import WorkspaceEvents from "../../../runtime/events/WorkspaceEvents";

export default function LayersPanel() {

  const [layers, setLayers] = useState(
    LayersController.all()
  );

  const [selected, setSelected] = useState(null);

  useEffect(() => {

    const refresh = () => {
      setLayers(LayersController.all());
    };

    const syncSelection = (payload) => {
      setSelected(payload.componentId);
    };

    WorkspaceEventBus.subscribe(
      WorkspaceEvents.HISTORY_UPDATED,
      refresh
    );

    WorkspaceEventBus.subscribe(
      WorkspaceEvents.SELECTION_CHANGED,
      syncSelection
    );

    refresh();

  }, []);

  function handleSelect(layer) {

    LayerSelectionBridge.select(layer);

  }

  return (
    <aside className="layers-panel">

      <h2>Layers</h2>

      {layers.length === 0 ? (
        <div className="layers-empty">
          No layers available
        </div>
      ) : (
        layers.map((layer) => (
          <LayerItem
            key={layer.id}
            layer={layer}
            selected={selected === layer.id}
            onSelect={handleSelect}
          />
        ))
      )}

    </aside>
  );
}
