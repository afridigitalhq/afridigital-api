/**
 * AfriDesign Preview Panel
 *
 * Purpose:
 * Composes preview workspace.
 *
 * Rule:
 * Composition only.
 */

import { useEffect } from "react";
import PreviewRuntimeBridge from "./preview/PreviewRuntimeBridge";
import PreviewToolbar from "./preview/PreviewToolbar";
import PreviewFrame from "./preview/PreviewFrame";
import PreviewMetadata from "./preview/PreviewMetadata";

export default function PreviewPanel() {

  useEffect(() => {
    PreviewRuntimeBridge.initialize();
  }, []);

  return (
    <div className="preview-panel">

      <PreviewToolbar />

      <PreviewFrame />

      <PreviewMetadata />

    </div>
  );
}
