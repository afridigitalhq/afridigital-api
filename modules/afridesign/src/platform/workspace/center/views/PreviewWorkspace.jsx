/**
 * AfriDesign Canonical App Preview Workspace
 * Purpose: Hosts the app-building preview surface.
 * Rule: Composition only.
 */
import PreviewWorkspaceShell from "../../../preview/shell/PreviewWorkspaceShell";

export default function PreviewWorkspace({ project, onExit }) {
  return <main className="afri-preview-workspace"><PreviewWorkspaceShell project={project} onExit={onExit} /></main>;
}
