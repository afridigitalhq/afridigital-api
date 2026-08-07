/**
 * AfriDesign Alignment Toolbar
 *
 * Purpose:
 * Provides manual object alignment controls.
 *
 * Rule:
 * UI composition only.
 */

import AlignmentController from "../../../canvas/alignment/actions/AlignmentController";

export default function AlignmentToolbar({
  selectedComponent
}) {

  if (!selectedComponent) {
    return null;
  }

  return (
    <div className="alignment-toolbar">

      <button
        onClick={() =>
          AlignmentController.alignLeft(
            selectedComponent
          )
        }
      >
        ━━━
        <span>Left</span>
      </button>


      <button
        onClick={() =>
          AlignmentController.alignCenter(
            selectedComponent
          )
        }
      >
        ━━━
        <span>Center</span>
      </button>


      <button
        onClick={() =>
          AlignmentController.alignRight(
            selectedComponent
          )
        }
      >
        ━━━
        <span>Right</span>
      </button>


      <button
        onClick={() =>
          AlignmentController.alignTop(
            selectedComponent
          )
        }
      >
        Top
      </button>


      <button
        onClick={() =>
          AlignmentController.alignMiddle(
            selectedComponent
          )
        }
      >
        Middle
      </button>


      <button
        onClick={() =>
          AlignmentController.alignBottom(
            selectedComponent
          )
        }
      >
        Bottom
      </button>

    </div>
  );
}
