/**
 * AfriDesign Platform Properties Panel
 *
 * Single Source of Truth
 * for the right sidebar.
 */

import { useEffect, useState } from "react";
import CanvasSelectionManager from "../canvas/controllers/CanvasSelectionManager";

export default function PlatformPropertiesPanel() {

  const [selection, setSelection] = useState([]);


  useEffect(() => {

    setSelection(CanvasSelectionManager.current());

    const unsubscribe =
      CanvasSelectionManager.subscribe(
        setSelection
      );

    return unsubscribe;

  }, []);


  const selectedObject = selection[0];


  return (

    <aside className="afridesign-platform-properties">

      <h3>Properties</h3>

      <section className="property-group">

        <strong>Selection</strong>

        <p>
          {
            selectedObject
              ? `${selectedObject.icon} ${selectedObject.name}`
              : "No item selected."
          }
        </p>

      </section>

      <section className="property-group">

        <strong>Position</strong>

      </section>

      <section className="property-group">

        <strong>Size</strong>

      </section>

      <section className="property-group">

        <strong>Appearance</strong>

      </section>

      <section className="property-group">

        <strong>Effects</strong>

      </section>

      <section className="property-group">

        <strong>Responsive</strong>

      </section>

      <hr />

      <button>⚙ Properties</button>

      <button>🔧 Settings</button>

      <button>📊 Inspector</button>

      <button>🛡 Security</button>

    </aside>

  );

}
