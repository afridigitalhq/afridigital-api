/**
 * AfriDesign Canvas Object Renderer
 *
 * Purpose:
 * Renders canvas objects.
 *
 * Rule:
 * Visual rendering only.
 */

import { useEffect, useState } from "react";
import CanvasSelectionManager from "../controllers/CanvasSelectionManager";

export default function CanvasObjectRenderer({ object }) {

  const [selected, setSelected] = useState(false);


  useEffect(() => {

    const updateSelection = (selection) => {

      setSelected(
        selection.some(
          item => item.id === object.id
        )
      );

    };


    updateSelection(
      CanvasSelectionManager.current()
    );


    const unsubscribe =
      CanvasSelectionManager.subscribe(
        updateSelection
      );


    return unsubscribe;

  }, [object.id]);


  function selectObject(){

    CanvasSelectionManager.select(object);

  }


  return (

    <div
      className={
        selected
          ? "canvas-object selected"
          : "canvas-object"
      }
      onClick={selectObject}
    >

      <span>{object.icon}</span>

      <span>{object.name}</span>

    </div>

  );

}
