/**
 * AfriDesign Tool Button
 *
 * Purpose:
 * Displays a single quick toolbar action.
 *
 * Rule:
 * UI composition only.
 */

export default function ToolButton({
  tool,
  onSelect
}) {

  return (
    <button
      className="afridesign-tool-button"
      onClick={() => onSelect?.(tool)}
      title={tool.name}
    >

      <span className="tool-icon">
        {tool.icon || "◼"}
      </span>

      <span className="tool-name">
        {tool.name}
      </span>

    </button>
  );

}
