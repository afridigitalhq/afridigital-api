/**
 * AfriDesign Mode Switcher
 *
 * Purpose:
 * Primary workspace navigation.
 *
 * Rule:
 * Composition only.
 */

import AfriDesignModeRegistry from "./AfriDesignModeRegistry";
import AfriDesignMoreMenu from "./AfriDesignMoreMenu";
import PlatformWorkspaceController from "../../shell/PlatformWorkspaceController";

export default function AfriDesignModeSwitcher(){

  return (

    <nav className="afri-mode-switcher">

      {
        AfriDesignModeRegistry.map(mode => (

          <button
            key={mode.id}
            onClick={() => {

              if(mode.workspace){

                PlatformWorkspaceController.open(
                  mode.workspace
                );

              }

            }}
          >

            <span>{mode.icon}</span>

            <span>{mode.name}</span>

          </button>

        ))
      }

      <details className="mode-more">

        <summary>
          ⋯ More
        </summary>

        <AfriDesignMoreMenu />

      </details>

    </nav>

  );

}
