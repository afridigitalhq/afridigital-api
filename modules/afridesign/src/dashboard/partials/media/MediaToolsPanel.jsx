/**
 * AfriDesign Media Tools Panel
 *
 * Purpose:
 * Provides image editing actions.
 *
 * Rule:
 * UI composition only.
 */

import MediaActionController from "../../../media/actions/MediaActionController";

export default function MediaToolsPanel({
  selectedAsset
}) {

  if (!selectedAsset) {
    return null;
  }


  return (
    <aside className="media-tools-panel">

      <h3>
        Image Tools
      </h3>


      <button
        onClick={() =>
          MediaActionController.removeBackground(
            selectedAsset.id
          )
        }
      >
        🪄 Remove Background
      </button>


      <button
        onClick={() =>
          MediaActionController.makeTransparent(
            selectedAsset.id
          )
        }
      >
        🔳 Make Transparent
      </button>


      <button
        onClick={() =>
          MediaActionController.crop(
            selectedAsset.id,
            {
              mode: "free"
            }
          )
        }
      >
        ✂ Crop Image
      </button>


      <button>
        ↔ Resize
      </button>


      <button>
        ✨ Enhance
      </button>


      <button>
        ⬇ Export Image
      </button>


    </aside>
  );

}
