/**
 * AfriDesign Platform Explorer
 *
 * Single Source of Truth
 * for the left explorer.
 *
 * Rule:
 * Composition only.
 */

import { useEffect, useState } from "react";
import ProjectExplorerController from "./ProjectExplorerController";

export default function PlatformExplorer(){

  const [resources, setResources] = useState([]);


  useEffect(() => {

    setResources(
      ProjectExplorerController.initialize()
    );

  }, []);


  function openResource(id){

    ProjectExplorerController.open(id);

    setResources(
      ProjectExplorerController.resources()
    );

  }


  return (

    <aside className="afridesign-platform-explorer">

      <h3>Explorer</h3>


      <section className="explorer-project-tree">

        {
          resources.map(resource => (

            <button

              key={resource.id}

              className="explorer-section"

              onClick={() =>
                openResource(resource.id)
              }

            >

              {resource.name}

            </button>

          ))
        }


      </section>


    </aside>

  );

}
