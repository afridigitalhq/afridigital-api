/**
 * AfriDesign More Menu
 *
 * Purpose:
 * Secondary tools menu.
 *
 * Rule:
 * Composition only.
 */

import AfriDesignMoreRegistry from "./AfriDesignMoreRegistry";

export default function AfriDesignMoreMenu(){

  return (

    <div className="afri-more-menu">

      {
        AfriDesignMoreRegistry.map(tool => (

          <button key={tool.id}>

            <span>{tool.icon}</span>

            <span>{tool.name}</span>

          </button>

        ))
      }

    </div>

  );

}
