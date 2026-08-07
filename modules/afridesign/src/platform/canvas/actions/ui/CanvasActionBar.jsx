/**
 * AfriDesign Canvas Action Bar
 *
 * Purpose:
 * Global canvas controls.
 *
 * Rule:
 * Composition only.
 */

export default function CanvasActionBar(){

  return (

    <header className="canvas-action-bar">

      <button>↶ Undo</button>

      <button>↷ Redo</button>

      <span className="toolbar-divider"></span>

      <button>🖥 Desktop</button>

      <button>📱 Mobile</button>

      <span className="toolbar-spacer"></span>

      <button>💾 Save</button>

      <button>🚀 Publish</button>

    </header>

  );

}
