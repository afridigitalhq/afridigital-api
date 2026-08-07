/**
 * AfriDesign Platform Dock
 *
 * Single Source of Truth
 * for the bottom dock.
 */

import AfriDesignDockRegistry from "./AfriDesignDockRegistry";

export default function PlatformDock() {

  return (

    <footer className="afridesign-platform-dock">

      {AfriDesignDockRegistry.map(item => (

        <button
          key={item.id}
          className="platform-dock-button"
        >

          <span>{item.icon}</span>

          <span>{item.name}</span>

        </button>

      ))}

    </footer>

  );

}
