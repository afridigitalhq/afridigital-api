/**
 * AfriDesign Canvas Tool Rail
 *
 * Purpose:
 * Visual editing tools.
 *
 * Rule:
 * Composition only.
 */

import CanvasEditingToolRegistry from "../CanvasEditingToolRegistry";

export default function CanvasToolRail(){

  return (

    <aside className="canvas-tool-rail">

      {
        CanvasEditingToolRegistry.map(tool => (

          <button key={tool.id}>

            <span>{tool.icon}</span>

          </button>

        ))
      }

    </aside>

  );

}
