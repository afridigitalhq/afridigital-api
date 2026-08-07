/**
 * AfriDesign Canvas Action Toolbar
 *
 * Purpose:
 * Hosts canvas editing actions.
 *
 * Rule:
 * UI composition only.
 */

export default function CanvasActionToolbar() {
  return (
    <div className="canvas-action-toolbar">

      <button>
        Duplicate
      </button>

      <button>
        Delete
      </button>

      <button>
        Bring Front
      </button>

      <button>
        Send Back
      </button>

      <button>
        Lock
      </button>

      <button>
        Unlock
      </button>

    </div>
  );
}
