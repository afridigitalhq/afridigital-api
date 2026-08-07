/**
 * Visual Inspector V2
 *
 * Composition only.
 */

import VisualInspectorRegistry from "./registry/VisualInspectorRegistry";

export default function VisualInspector(){

  return(

    <aside className="visual-inspector">

      {
        VisualInspectorRegistry.map(panel=>(

          <section
            key={panel.id}
            className="visual-inspector-panel"
          >

            <header className="visual-inspector-title">

              <span>{panel.icon}</span>

              <h3>{panel.name}</h3>

            </header>

            <panel.component/>

          </section>

        ))
      }

    </aside>

  );

}
