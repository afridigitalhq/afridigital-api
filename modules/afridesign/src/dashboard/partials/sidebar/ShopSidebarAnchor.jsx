/**
 * AfriDesign Shop Sidebar Anchor
 *
 * Purpose:
 * Provides entry point into
 * AfriDesign marketplace.
 *
 * Rule:
 * UI composition only.
 */

export default function ShopSidebarAnchor({
  onOpen
}) {

  return (
    <button
      className="afridesign-sidebar-shop"
      onClick={onOpen}
    >

      <span>
        🛒
      </span>

      <span>
        AfriDesign Shop
      </span>

    </button>
  );

}
