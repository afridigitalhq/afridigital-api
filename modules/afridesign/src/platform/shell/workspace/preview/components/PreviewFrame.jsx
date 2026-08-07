/**
 * AfriDesign Preview Frame
 *
 * Purpose:
 * Hosts the live visual canvas.
 *
 * Rule:
 * UI composition only.
 */

import { useEffect } from "react";
import CanvasRuntime from "../../../canvas/runtime/CanvasRuntime";
import MeasurementOverlay from "../canvas/MeasurementOverlay";
import CanvasGuideOverlay from "../canvas/CanvasGuideOverlay";
import ResizeMeasurementOverlay from "../canvas/ResizeMeasurementOverlay";

export default function PreviewFrame() {

  useEffect(() => {
    CanvasRuntime.initialize();
  }, []);

  return (
    <section className="preview-frame">

      <div className="canvas-drop-zone">

        <CanvasGuideOverlay />

        <MeasurementOverlay />

        <ResizeMeasurementOverlay />

        <div className="canvas-placeholder">
          Drag components here
        </div>

      </div>

    </section>
  );
}
