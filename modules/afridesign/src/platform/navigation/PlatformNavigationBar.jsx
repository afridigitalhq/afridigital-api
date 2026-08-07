/**
 * AfriDesign Platform Navigation
 *
 * Single Source of Truth
 * for top navigation.
 */

import PlatformNavigationRegistry from "./PlatformNavigationRegistry";
import PlatformWorkspaceController from "../shell/PlatformWorkspaceController";

const TopActions = [
  { id: "ai", label: "AfriAI", icon: "🤖" },
  { id: "deploy", label: "Deploy", icon: "☁️" },
  { id: "ecosystem", label: "Ecosystem", icon: "🌍" }
];

export default function PlatformNavigationBar() {

  const active = PlatformWorkspaceController.current();

  return (

    <nav className="afridesign-platform-nav">

      <div className="platform-nav-workspaces">

        {PlatformNavigationRegistry.map(item => (

          <button
            key={item.id}
            className={
              active?.id === item.workspace
                ? "platform-nav-button active"
                : "platform-nav-button"
            }
            onClick={() =>
              PlatformWorkspaceController.open(item.workspace)
            }
          >

            <span>{item.icon}</span>
            <span>{item.label}</span>

          </button>

        ))}

      </div>

      <div className="platform-nav-actions">

        {TopActions.map(action => (

          <button
            key={action.id}
            className="platform-action-button"
            onClick={() =>
              action.id === "ai" &&
              PlatformWorkspaceController.open("ai")
            }
          >

            <span>{action.icon}</span>
            <span>{action.label}</span>

          </button>

        ))}

      </div>

    </nav>

  );

}
