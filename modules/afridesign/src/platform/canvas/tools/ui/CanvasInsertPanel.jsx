/**
 * AfriDesign Canvas Insert Panel
 *
 * Purpose:
 * Creation toolbox.
 *
 * Rule:
 * Composition only.
 */

import CanvasObjectRegistry from "../../layers/CanvasObjectRegistry";

export default function CanvasInsertPanel(){

  return (

    <aside className="canvas-insert-panel">

      <h3>Add</h3>

      {
        CanvasObjectRegistry.map(object => (

          <button key={object.id}>

            <span>{object.icon}</span>

            <span>{object.name}</span>

          </button>

        ))
      }

    </aside>

  );

}
