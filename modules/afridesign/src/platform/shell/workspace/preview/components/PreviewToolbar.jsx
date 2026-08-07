/**
 * AfriDesign Preview Toolbar
 *
 * Purpose:
 * Controls preview viewport selection.
 *
 * Rule:
 * UI controls only.
 */

export default function PreviewToolbar() {
  return (
    <div className="preview-toolbar">
      <button>Desktop</button>
      <button>Tablet</button>
      <button>Mobile</button>
    </div>
  );
}
