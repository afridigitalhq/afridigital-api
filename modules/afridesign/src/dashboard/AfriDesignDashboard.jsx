/**
 * AfriDesign Dashboard
 *
 * Composition shell only.
 */

import { useEffect } from "react";
import "../platform/shell/shell.css";
import WorkspaceCoordinator from "../runtime/WorkspaceCoordinator";
import ProjectHeader from "../platform/shell/header/ProjectHeader";
import Explorer from "../platform/shell/workspace/explorer/Explorer";
import CenterWorkspaceRouter from "../platform/workspace/center/CenterWorkspaceRouter";

export default function AfriDesignDashboard() {

  useEffect(() => {
    WorkspaceCoordinator.initialize();
  }, []);

  return (
    <main className="afridesign-dashboard">
      <ProjectHeader />

      <div className="afridesign-layout">
        <Explorer />
        <CenterWorkspaceRouter />
      </div>
    </main>
  );
}
