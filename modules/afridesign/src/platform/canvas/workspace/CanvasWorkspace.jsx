/**
 * AfriDesign Canvas Workspace
 *
 * Main visual creation area.
 *
 * Rule:
 * Composition only.
 */

import CanvasObjectRegistry from "../layers/CanvasObjectRegistry";
import CanvasObjectRenderer from "../layers/CanvasObjectRenderer";
import CanvasToolRail from "../tools/ui/CanvasToolRail";
import CanvasInsertPanel from "../tools/ui/CanvasInsertPanel";
import CanvasActionBar from "../actions/ui/CanvasActionBar";
import CanvasArtboard from "./CanvasArtboard";
import CanvasQuickActions from "./CanvasQuickActions";


export default function CanvasWorkspace(){

 return (

  <section className="afri-canvas-workspace">

    <CanvasActionBar />


    <div className="canvas-editor-layout">

      <CanvasInsertPanel />

      <CanvasToolRail />


      <main className="canvas-stage">

        <CanvasArtboard>

          {
            CanvasObjectRegistry.map(object => (

              <CanvasObjectRenderer

                key={object.id}

                object={object}

              />

            ))
          }

        </CanvasArtboard>

      </main>


    </div>


    <CanvasQuickActions />


  </section>

 );

}
